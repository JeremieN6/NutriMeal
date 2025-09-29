// Netlify Function: generate-recipes
// POST /.netlify/functions/generate-recipes
// Body: { ingredients: string[], count?: number, diet?: string, cuisine?: string }

// Load env for local dev (try .env.local then .env)
try {
  const fs = require('fs')
  const path = require('path')
  const dotenv = require('dotenv')
  const root = path.resolve(__dirname, '..', '..')
  const envLocal = path.join(root, '.env.local')
  const envDefault = path.join(root, '.env')
  if (fs.existsSync(envLocal)) dotenv.config({ path: envLocal })
  else if (fs.existsSync(envDefault)) dotenv.config({ path: envDefault })
} catch (_) { /* ignore */ }

const OpenAI = require('openai')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const ALLOWED_ORIGIN = '*'

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' })
  }

  try {
    const payload = JSON.parse(event.body || '{}')
    const { ingredients = [], count = 3, diet, cuisine } = payload

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return json(400, { error: 'Veuillez fournir une liste d\'ingrédients non vide.' })
    }

    const safeCount = Math.max(1, Math.min(Number(count) || 3, 3))

    const system = `Tu es un assistant culinaire francophone. Tu proposes des recettes réalistes et simples à partir d'ingrédients disponibles dans un frigo.
Contraintes:
- N'invente pas des ingrédients non fournis.
- Si nécessaire, tu peux proposer au maximum 3 ingrédients manquants courants (ex: oignons, œufs, huile, sel, poivre) pour compléter une recette.
- Propose maximum ${safeCount} recettes.
- Donne des temps de préparation et de cuisson en minutes, des quantités indicatives, et des conseils pratiques.
- Sors strictement en JSON correspondant au schéma demandé.`

    const user = {
      role: 'user',
      content: [
        { type: 'text', text: `Ingrédients disponibles: ${ingredients.join(', ')}` },
        { type: 'text', text: cuisine ? `Cuisine: ${cuisine}` : '' },
        { type: 'text', text: diet ? `Régime/contraintes: ${diet}` : '' },
        { type: 'text', text: `Réponds en JSON strict selon ce schéma:
{
  "recipes": [
    {
      "title": string,
      "description": string,
      "servings": number,
      "prepMinutes": number,
      "cookMinutes": number,
      "ingredientsUsed": [{"name": string, "quantity": string, "optional": boolean}],
      "missingIngredients": string[],
      "steps": string[],
      "tips": string[],
      "tags": string[]
    }
  ],
  "suggestionsIfAdd": [
    { "add": string[], "idea": string }
  ]
}

Règles:
- "ingredientsUsed" ne doit lister que des ingrédients disponibles (ou des basiques de placard comme sel/poivre/huile).
- "missingIngredients" max 3 par recette, facultatifs.
- "suggestionsIfAdd": 1 à 3 idées de plats si on ajoutait 1 à 3 ingrédients, basées sur ce qui manque le plus.
` }
      ].filter(Boolean)
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [ { role: 'system', content: system }, user ]
    })

    const content = completion.choices?.[0]?.message?.content || '{}'
    let data
    try {
      data = JSON.parse(content)
    } catch (e) {
      // fallback: wrap as error if model returned invalid JSON
      return json(502, { error: 'Format de réponse invalide', raw: content })
    }

    // Basic sanitation
    if (!Array.isArray(data.recipes)) data.recipes = []
    if (!Array.isArray(data.suggestionsIfAdd)) data.suggestionsIfAdd = []

    return json(200, data)
  } catch (err) {
    console.error('generate-recipes error', err)
    const message = err?.message || 'Erreur serveur'
    return json(500, { error: message })
  }
}

function corsHeaders () {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  }
}

function json (statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(body)
  }
}
