import { FaUserGraduate } from "react-icons/fa";

export default function PreferencesSettings() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-2xl mx-auto mb-4">
                <FaUserGraduate />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Student Preferences</h2>
            <p className="text-gray-500 text-sm">Set your preferences for student matching.</p>
             <div className="mt-8 p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-200 inline-block">
                Feature coming soon.
            </div>
        </div>
    )
}
