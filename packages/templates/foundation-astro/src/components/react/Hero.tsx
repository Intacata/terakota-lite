import { useState } from 'react';
export default function Hero() {
    const [n, setN] = useState(0);
    return (
        <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">TERAKOTA_FOUNDATION_NAME</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Terakota Foundation &middot; Astro + React + Tailwind
            </p>
            <button onClick={() => setN(c => c + 1)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                Clicked {n} {n === 1 ? 'time' : 'times'}
            </button>
        </div>
    );
}
