const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Fonction pour générer un token aléatoire
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Fonction pour sauvegarder le token
async function saveToken(token, userData) {
  const tokensPath = path.join(__dirname, '.netlify', 'tokens.json');
  
  try {
    // Lire le fichier existant ou créer un nouvel objet
    let tokens = {};
    try {
      const data = await fs.readFile(tokensPath, 'utf8');
      tokens = JSON.parse(data);
    } catch (error) {
      // Le fichier n'existe pas encore, on continue avec un objet vide
    }

    // Ajouter le nouveau token
    tokens[token] = {
      ua: userData.ua,
      ip: userData.ip,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 heures
    };

    // Sauvegarder le fichier
    await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du token:', error);
    return false;
  }
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const userData = JSON.parse(event.body);
    const token = generateToken();
    
    const saved = await saveToken(token, {
      ua: userData.ua,
      ip: event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown'
    });

    if (!saved) {
      throw new Error('Erreur lors de la sauvegarde du token');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ token })
    };
  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur lors de la création du token' })
    };
  }
}; 