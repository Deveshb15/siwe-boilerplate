import type { NextPage } from 'next';
import type { FC } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe'

const Home: NextPage = () => {

  const { address } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()

  const signIn = async() => {
    const nonceRes = await fetch('/api/nonce')
    const nonce = await nonceRes.text()
    
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to the app.',
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
      nonce
    })

    // console.log({ message: message.prepareMessage() })
    const signature = await signMessageAsync({ message: message.prepareMessage() })
    // console.log({ signature })

    const verifyRes = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature }),
    });

    const verifyData = await verifyRes.json()
    console.log(verifyData)
  }

  return (
    <div className='py-6 justify-center text-center'>

      <h1 className='text-4xl font-bold mt-6'>Sign In With Ethereum🚀</h1>

      <div className='flex justify-center gap-4 py-8'>
        <ConnectButton />
        <button onClick={signIn} className='px-4 py-2 bg-black text-white transform hover:scale-105 rounded-xl'>Sign In With Ethereum</button>
      </div>

      <InfoSection />
    </div>
  );
};

const InfoSection: FC = () => {
  return (
    <div className='mt-8'>
      <h2 className='text-xl font-bold'>If you need help</h2>
      <div className='flex flex-col gap-2 mt-2'>
        <a
          href='https://wagmi.sh'
          target='_blank'
          className='underline text-gray-600'
        >
          Link to wagmi docs
        </a>
        <a
          href='https://github.com/dhaiwat10/create-web3-frontend'
          target='_blank'
          className='underline text-gray-600'
        >
          Open an issue on Github
        </a>
        <a
          href='https://twitter.com/dhaiwat10'
          target='_blank'
          className='underline text-gray-600'
        >
          DM me on Twitter
        </a>
      </div>
    </div>
  );
};

export default Home;
