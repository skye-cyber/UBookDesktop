import React from 'react';

export const BookmarkModal = ({ }) => {
    return (
        <div id="bookmarksModal" className="fixed inset-0 flex items-center justify-center z-50 hidden">
            <div className="modal-overlay absolute inset-0"></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 z-10">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Bookmarks</h3>
                    <div id="bookmarksList" className="max-h-96 overflow-y-auto">
                    {/* Bookmarks will be listed here */}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick="closeBookmarksModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
