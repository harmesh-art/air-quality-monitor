import React, { useState } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';

const SearchBar = ({ onSearch, onLocate, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) onSearch(query);
    };

    return (
        <div className="glass-panel search-bar-container mb-8">
            <div className="search-icon-wrapper text-muted">
                <MapPin size={20} />
            </div>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter city name..."
                    className="search-input"
                />
            </form>
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="search-btn"
                aria-label="Search"
            >
                <Search size={20} />
            </button>
            <div className="divider"></div>
            <button
                onClick={onLocate}
                disabled={isLoading}
                className="locate-btn btn-primary"
            >
                <Navigation size={16} />
                {isLoading ? 'Locating...' : 'Use My Location'}
            </button>
        </div>
    );
};

export default SearchBar;
