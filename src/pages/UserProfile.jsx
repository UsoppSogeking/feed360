// UserProfile.js
import { useEffect, useState } from 'react';
import useFirestoreUser from '../hooks/useFirestoreUser';
import { useAuth } from '../hooks/useAuth';
import { storage, db } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

//components
import EditModal from '../components/EditModal';

import { CameraIcon, ArrowLongLeftIcon } from '@heroicons/react/24/outline'

const UserProfile = () => {
    const [photoUrl, setPhotoUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const { user, loading } = useAuth();
    const { firestoreUser, loading: userLoading } = useFirestoreUser(user?.uid);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    }

    // Atualiza a foto de perfil quando firestoreUser.photoUrl muda
    useEffect(() => {
        setPhotoUrl(firestoreUser?.photoUrl || '');
    }, [firestoreUser]);

    const handleImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const storageRef = ref(storage, `profileImages/${user.uid}`);
            setUploading(true);

            try {
                // Faz upload da imagem para o armazenamento do Firebase
                await uploadBytes(storageRef, file);
                // Obtém a URL de download da imagem
                const newPhotoUrl = await getDownloadURL(storageRef);
                // Atualiza o estado local da URL da imagem
                setPhotoUrl(newPhotoUrl);
                // Atualiza o FirestoreUser com a nova URL da imagem
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, { photoUrl: newPhotoUrl });
                setUploading(false);
            } catch (error) {
                console.error("Error uploading image: ", error);
                setUploading(false);
            }
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading || userLoading) return <div>Carregando...</div>

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <button className="text-gray-500" onClick={() => goHome()}><ArrowLongLeftIcon className='block w-5 h-5 text-gray-900' /></button>
                    <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
                    <button className="text-indigo-600" onClick={openModal}>Edit</button>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                <div className="text-white">Carregando...</div>
                            </div>
                        )}
                        <img
                            className="w-24 h-24 rounded-full object-cover"
                            src={photoUrl || "https://i.pinimg.com/originals/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg"}
                            alt="Profile"
                        />
                        <label htmlFor="image-upload" className="absolute -bottom-0 -left-0 bg-white p-1 rounded-full border border-gray-300 cursor-pointer">
                            <CameraIcon className="block h-6 w-6" />
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="text-center mt-4">
                        <h3 className="text-xl font-semibold">{firestoreUser?.name}</h3>
                        <p className="text-gray-500">{user?.uid}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-gray-900">{firestoreUser?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <p className="mt-1 text-gray-900">{`${firestoreUser?.phone || "(XX) X XXXX-XXXX"}`}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Twittwer</label>
                            <p className="mt-1 text-gray-900">Link to your Twittwer</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Linkedin</label>
                            <p className="mt-1 text-gray-900">Link to your Linkedin</p>
                        </div>
                    </div>
                </div>
            </div>
            <EditModal user={firestoreUser} isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default UserProfile;
