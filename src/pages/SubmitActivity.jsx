import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { uploadToImgBB } from '../services/imgbb';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Upload, Camera, Dumbbell, X, Check } from 'lucide-react';

const SubmitActivity = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        activity_type: 'pushup',
        count: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size too large (max 5MB)');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting activity form...', formData);

        if (!selectedFile) {
            console.warn('No file selected!');
            setError('Please provide a photo proof');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 1. Upload to ImgBB
            console.log('Uploading file to ImgBB...');
            const { url: imageUrl, id: imageId } = await uploadToImgBB(selectedFile);
            console.log('File uploaded successfully, URL:', imageUrl, 'ID:', imageId);

            // 2. Submit to Backend
            const payload = {
                ...formData,
                count: Number(formData.count),
                image_url: imageUrl,
                image_proof_id: imageId
            };

            console.log('Sending activity data to backend:', payload);
            await api.post('/activities', payload);

            console.log('Activity submitted successfully!');
            navigate('/activities');
        } catch (err) {
            console.error('Failed to submit activity', err);
            setError(err.message || 'Failed to submit activity. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Log Activity</h1>
                <p className="text-slate-500">Submit your daily exercise proof.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 ml-1">Activity Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['pushup', 'situp', 'backup'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, activity_type: type })}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.activity_type === type
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-100'
                                        }`}
                                >
                                    <Dumbbell className={`mb-2 ${formData.activity_type === type ? 'text-primary-500' : 'text-slate-400'}`} size={24} />
                                    <span className="capitalize font-medium">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Repetition Count"
                        type="number"
                        placeholder="e.g. 50"
                        value={formData.count}
                        onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                        required
                        min="1"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Photo Proof</label>

                        {!previewUrl ? (
                            <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Camera className="text-slate-400 group-hover:text-slate-600" size={24} />
                                </div>
                                <p className="font-medium text-slate-900">Click to upload photo</p>
                                <p className="text-sm text-slate-500 mt-1">or drag and drop here (max 5MB)</p>
                            </label>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-slate-200">
                                <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-full text-slate-600 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                                <div className="absolute bottom-2 right-2 px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                                    <Check size={12} /> Ready to upload
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="pt-4">
                        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                            {isLoading ? 'Uploading & Submitting...' : 'Submit Activity'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SubmitActivity;
