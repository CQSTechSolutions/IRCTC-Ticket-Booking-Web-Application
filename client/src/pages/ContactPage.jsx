const ContactPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log({
            name: formData.get('name'),
            email: formData.get('email'), 
            subject: formData.get('subject'),
            message: formData.get('message'),
            type: formData.get('type')
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 px-6 sm:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-10 transform hover:scale-[1.01] transition-transform duration-300 border border-gray-100">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-12 text-center animate-fade-in tracking-tight">
                        Contact & Support
                    </h1>
                    
                    <div className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6 animate-fade-in-up">How Can We Help?</h2>
                            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed italic text-sm">
                                Whether you need assistance with bookings, have feedback, or want to report an issue, 
                                we're here 24/7 to ensure your train journey is smooth and comfortable.
                            </p>
                        </div>

                        

                        <form onSubmit={handleSubmit} className="space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 p-10 rounded-2xl shadow-inner">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="transform transition-all duration-300 hover:scale-[1.02] group">
                                    <label htmlFor="name" className="block italic text-sm font-medium text-gray-700 group-hover:text-blue-600 mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        required
                                        className="mt-1 block w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 py-3 px-4 italic text-sm" 
                                        placeholder="John Doe"
                                    />
                                </div>
                                
                                <div className="transform transition-all duration-300 hover:scale-[1.02] group">
                                    <label htmlFor="email" className="block italic text-sm font-medium text-gray-700 group-hover:text-blue-600 mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        required
                                        className="mt-1 block w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 py-3 px-4 italic text-sm" 
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="transform transition-all duration-300 hover:scale-[1.02] group">
                                <label htmlFor="type" className="block italic text-sm font-medium text-gray-700 group-hover:text-blue-600 mb-2">Contact Type</label>
                                <select 
                                    name="type" 
                                    id="type" 
                                    required
                                    className="mt-1 block w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 py-3 px-4 italic text-sm"
                                >
                                    <option value="booking">Booking Assistance</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="complaint">Complaint</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="transform transition-all duration-300 hover:scale-[1.02] group">
                                <label htmlFor="subject" className="block italic text-sm font-medium text-gray-700 group-hover:text-blue-600 mb-2">Subject</label>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    id="subject" 
                                    required
                                    className="mt-1 block w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 py-3 px-4 italic text-sm" 
                                    placeholder="Brief subject of your message"
                                />
                            </div>

                            <div className="transform transition-all duration-300 hover:scale-[1.02] group">
                                <label htmlFor="message" className="block italic text-sm font-medium text-gray-700 group-hover:text-blue-600 mb-2">Message</label>
                                <textarea 
                                    name="message" 
                                    id="message" 
                                    rows="5" 
                                    required
                                    className="mt-1 block w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 py-3 px-4 italic text-sm"
                                    placeholder="Please describe your query in detail..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl italic text-sm font-semibold
                                hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2
                                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                            >
                                Send Message
                            </button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl transform hover:-translate-y-3 transition-all duration-300 shadow-md hover:shadow-2xl">
                                <h3 className="text-xl font-medium text-blue-800 mb-4">Main Office</h3>
                                <p className="text-gray-700 italic text-sm">
                                    123 Railway Street<br />
                                    New Delhi, 110001<br />
                                    India
                                </p>
                            </div>
                            
                            <div className="p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl transform hover:-translate-y-3 transition-all duration-300 shadow-md hover:shadow-2xl">
                                <h3 className="text-xl font-medium text-indigo-800 mb-4">Contact Info</h3>
                                <p className="text-gray-700 italic text-sm">
                                    support@railwayservice.com<br />
                                    +91 1800-123-4567<br />
                                    24/7 Customer Support
                                </p>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl transform hover:-translate-y-3 transition-all duration-300 shadow-md hover:shadow-2xl">
                                <h3 className="text-xl font-medium text-purple-800 mb-4">Emergency</h3>
                                <p className="text-gray-700 italic text-sm">
                                    Railway Police: 1800-111-222<br />
                                    Medical Emergency: 108<br />
                                    Available 24/7
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;