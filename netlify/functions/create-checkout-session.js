import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1RY1KHDcigxHe4yWLi8bfy2r',
          quantity: 1
        }
      ],
      success_url: 'https://calculateur-de-tjm.netlify.app/success',
      cancel_url: 'https://calculateur-de-tjm.netlify.app/cancel'
      // success_url: 'http://localhost:8888/success',
      // cancel_url: 'http://localhost:8888/cancel'
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}
