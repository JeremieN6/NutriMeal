const fs = require('fs').promises;
const path = require('path');

async function verifyToken(token, userData) {
  const tokensPath = path.join(__dirname, '.netlify', 'tokens.json');
  
  try {
    // Lire le fichier des tokens
    const data = await fs.readFile(tokensPath, 'utf8');
    const tokens = JSON.parse(data);

    // Vérifier si le token existe
    if (!tokens[token]) {
      return false;
    }

    const tokenData = tokens[token];

    // Vérifier l'expiration
    if (Date.now() > tokenData.exp) {
      // Supprimer le token expiré
      delete tokens[token];
      await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));
      return false;
    }

    // Vérifier le User-Agent
    if (tokenData.ua !== userData.ua) {
      return false;
    }

    // Vérifier l'IP si disponible
    if (userData.ip && tokenData.ip !== 'unknown' && tokenData.ip !== userData.ip) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
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
    const { token, ua, ip } = JSON.parse(event.body);
    
    if (!token || !ua) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token et User-Agent requis' })
      };
    }

    const isValid = await verifyToken(token, {
      ua,
      ip: ip || event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ authorized: isValid })
    };
  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur lors de la vérification du token' })
    };
  }
}; 