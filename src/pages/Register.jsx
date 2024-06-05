import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);

    const { register, loading, error: registerError } = useAuth();

    const navigate = useNavigate();

    const isPasswordValid = (password) => {
        //verifica se a senha tem pelo menos 6 caracteres e contem letras e numeros
        const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!.@']).{8,}$/;
        return regex.test(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (confirmPassword !== password) {
            setError("As senhas não conferem");
            return;
        }

        if (!isPasswordValid(password)) {
            setError("Senha inválida. Use pelo menos 8 caracteres, incluindo números, letras maiúsculas e um dos seguintes símbolos: !, ., @ ou '.");
            return;
        }

        try {
            await register(name, email, password);

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            navigate("/");
        } catch (err) {
            console.log(err.message);
        }

    }

    return (
        <div className='bg-[url(./images/registerwallpaper.svg)] bg-no-repeat bg-cover bg-bottom h-screen md:bg-center'>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Register
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="additional-name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name || ""}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email || ""}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password || ""}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmpassword" className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmpassword"
                                    name="confirmpassword"
                                    type="password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-inherit outline-none"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword || ""}
                                />
                            </div>
                        </div>

                        <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {loading ? <Spinner /> : "Continue"}
                                </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Are you a member?{' '}
                        <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Login
                        </a>
                    </p>
                    {error && <p>{error}</p>}
                    {registerError && <p>{registerError}</p>}
                </div>
            </div>
        </div>
    )
}

export default Register