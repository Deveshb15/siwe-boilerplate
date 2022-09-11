import { ironOptions } from "@/utils";
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { SiweMessage } from 'siwe'

const handler = async(req: NextApiRequest, res: NextApiResponse) => {

    const { method } = req;

    switch(method) {
        case 'POST':
            try {
                const { message, signature } = req.body
                const siweMessage = new SiweMessage(message)

                // validate sig
                const fields = await siweMessage.validate(signature)

                // return an error if the sig is invalid
                if(fields.nonce !== req.session.nonce) 
                    return res.status(422).json({ ok: false, message: 'Invalid nonce.' })
                
                // update the session if sig is valid
                req.session.siwe = fields;
                await req.session.save()
                res.json({ ok: true })
            } catch(err) {
                res.json({ ok: false })
            }
            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}

export default withIronSessionApiRoute(handler, ironOptions)