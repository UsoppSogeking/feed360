import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EditModal = ({ user, isOpen, onClose }) => {

    const formatPhoneNumber = (phoneNumber) => {
        // Remove todos os caracteres não numéricos do número de telefone
        const cleaned = phoneNumber.replace(/\D/g, '');

        // Aplica a formatação específica: (XX) X XXXX-XXXX
        const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
        }

        // Se o número de telefone não corresponder ao padrão esperado, retorna o número original
        return phoneNumber;
    };

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(formatPhoneNumber(user?.phone || ''));
    const [twitter, setTwitter] = useState(user?.twitter || '');
    const [linkedin, setLinkedin] = useState(user?.linkedin || '');

    const handleSave = async () => {
        try {
            const userRef = doc(db, 'users', user?.userId);
            await updateDoc(userRef, {
                name: name,
                email: email,
                phone: phone,
                twitter: twitter,
                linkedin: linkedin
            });
            onClose(); // Fechar o modal após salvar com sucesso

            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            // Lidar com erros de atualização aqui, se necessário
        }
    };

    const handleClose = () => {
        onClose(); // Fechar o modal
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" id="name" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-inherit" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-inherit" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="text" id="phone" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-inherit" value={phone} onChange={(e) => setPhone(formatPhoneNumber(e.target.value))} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter</label>
                            <input type="text" id="twitter" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-inherit" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
                            <input type="text" id="linkedin" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-inherit" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md mr-2" onClick={handleSave}>Save</button>
                            <button className="text-gray-700 px-4 py-2 rounded-md" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditModal;
