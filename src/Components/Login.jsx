import '../App.css';
import { Link } from 'react-router-dom';

function Login() {
  const loginWithGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className='flex items-center justify-center'>
      <div className="min-h-screen min-w-screen flex items-center justify-center flex-col bg-[#ffffff]">
        {/* Header */}
        <header className="py-[20px] border-b-[#e5e5e5] bg-[#ffffff]">
          <div className="px-[20px] mx-auto flex-1">
            <h1 className="text-2xl no-underline hover:text-[#333333]">
              <Link to='/home' className='font-[600] text-[#000000] m-0'> TicTacToe </Link>
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="md:px-[20px] md:py-[40px] flex-1 flex items-center justify-center py-[80px] px-[40px] bg-white">
          <div className=" w-[300px] text-center">
            <h2 className="md:text-[28px] text-[32px] font-semibold text-black mb-4 leading-[1.2]">Log in or sign up</h2>
            <p className="login-subtitle text-base text-[#666] mb-8 leading-[1.5]">
              You'll get smarter gameplay and can play with friends, track scores, and more.
            </p>

            {/* Email Input */}
            <div className="input-container mb-[20px]">
              <input
                type="email"
                placeholder="Email address"
                className="w-full max-w-[300px] mx-auto px-5 py-4 text-base border border-[#e5e5e5] rounded-lg bg-white text-black outline-none transition-colors duration-200 focus:border-black placeholder:text-[#999]"
              />
            </div>

            {/* Continue Button */}
            <button className="w-full max-w-[300px] mx-auto px-5 py-4 text-base font-semibold bg-black text-white rounded-lg mb-6 cursor-pointer transition-colors duration-200 hover:bg-[#333]">
              Continue
            </button>

            {/* OR Divider */}
            <div className="before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-200 relative my-6 text-[#666666] text-sm max-w-[300px] mx-auto">
              <span className='relative z-[1] bg-white px-4'>OR</span>
            </div>

            {/* Google Login Button */}
            <button onClick={loginWithGoogle} className="w-full max-w-[300px] sm:max-w-full mx-auto px-5 py-4 text-base font-medium bg-white text-black border border-[#e5e5e5] rounded-lg cursor-pointer flex items-center justify-center gap-3 transition-colors duration-200 hover:bg-[#f5f5f5] hover:border-[#cccccc]">
              <svg className=" w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
