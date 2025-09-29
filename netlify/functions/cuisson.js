const { OpenAI } = require("openai");
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body);

    // Sécurisation des entrées
    const aliment = String(body.aliment || "").trim();
    const poids = String(body.poids || "").trim();
    const quantite = String(body.quantite || "").trim();
    const etat = String(body.etat || "").trim();
    const typeCuisson = String(body.typeCuisson || "").trim();
    const modele = String(body.modele || "").trim();

    // Construction d'une chaîne pour inclure poids et/ou quantité dans le prompt
    let poidsOuQuantite = "";
    if (poids && String(poids).trim() !== "") {
        poidsOuQuantite += ` - Poids : ${poids}`;
    }
    if (quantite && String(quantite).trim() !== "") {
        // Ajoutez une virgule si le poids était aussi spécifié
        if (poidsOuQuantite !== "") poidsOuQuantite += ", ";
        poidsOuQuantite += ` - Quantité : ${quantite}`;
    }
    // Si ni poids ni quantité n'est spécifié, l'IA devra peut-être faire une estimation basée sur l'aliment seul.
    if (poidsOuQuantite === "") {
          poidsOuQuantite = " - Poids ou Quantité : non spécifié(s)";
    }

    const prompt = `
        Tu es un expert en cuisson avec un air fryer. Voici les caractéristiques :
        - Aliment : ${aliment}
        - Poids : ${poids}
        - Quantité : ${quantite}
        - État : ${etat}
        - Type de cuisson souhaitée : ${typeCuisson}
        - Modèle d'air fryer : ${modele || "non précisé"}

        Donne-moi uniquement ce bloc :
        ---
        Aliment : ${aliment} (${etat})
        Temps de cuisson : XX minutes
        Température : XXX°C
        Préparation : ...
        ---
        `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Tu es un expert en cuisson avec un air fryer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error("Erreur OpenAI :", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur" }),
    };
  }
};
