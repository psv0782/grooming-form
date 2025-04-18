import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, PawPrint } from 'lucide-react';

export default function App() {
    const [step, setStep] = useState('form');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        datetime: '',
        service: 'Full Grooming'
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.datetime) {
            setError('Please fill out all fields.');
            return;
        }
        setError('');
        setStep('loading');
        try {
            const response = await fetch('https://n8n.dentalogic.co.uk/webhook/webhook-grooming', {
                method: 'POST',
                body: new URLSearchParams(formData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (response.ok) {
                setStep('success');
            } else {
                setError('Something went wrong. Please try again.');
                setStep('form');
            }
        } catch (err) {
            setError('Network error.');
            setStep('form');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-5xl">
                    <PawPrint className="text-pink-500 animate-bounce" />
                </div>

                <AnimatePresence mode="wait">
                    {step === 'form' && (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col gap-4 mt-8"
                        >
                            <h2 className="text-xl font-bold text-center">Grooming Booking</h2>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <input name="name" placeholder="Name" onChange={handleChange} className="input" />
                            <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
                            <input name="datetime" type="datetime-local" onChange={handleChange} className="input" />
                            <select name="service" onChange={handleChange} className="input">
                                <option>Full Grooming</option>
                                <option>Bath & Brush</option>
                                <option>Mini Grooming</option>
                            </select>
                            <button type="submit" className="bg-pink-500 text-white font-bold py-2 rounded-xl hover:bg-pink-600 transition">Confirm</button>
                        </motion.form>
                    )}

                    {step === 'loading' && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-2 text-pink-500">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-500"></div>
                            <p>Sending your request...</p>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                            <p className="text-lg font-semibold">Thank you! 🐾</p>
                            <p className="text-sm text-gray-500">We have received your booking and will get back to you shortly.</p>
                            <button onClick={() => setStep('form')} className="mt-4 text-pink-500 underline">Submit another</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
