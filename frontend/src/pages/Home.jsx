import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePdf } from '../context/PdfContext';
import PdfCard from '../components/PdfCard';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const categories = ['All', 'Web Development', 'Programming', 'Design', 'AI/ML', 'Marketing'];

// Enhanced category keywords for better fuzzy matching
const categoryKeywords = {
    'Web Development': ['frontend', 'backend', 'javascript', 'react', 'html', 'css', 'node', 'web', 'website', 'fullstack'],
    'Programming': ['coding', 'software', 'algorithm', 'data structure', 'python', 'java', 'c++', 'development', 'code'],
    'Design': ['ui', 'ux', 'graphic', 'visual', 'photoshop', 'figma', 'adobe', 'creative', 'interface', 'user experience'],
    'AI/ML': ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'data science', 'tensorflow', 'pytorch', 'ml', 'ai'],
    'Marketing': ['digital marketing', 'seo', 'social media', 'advertising', 'branding', 'content marketing', 'analytics', 'promotion']
};


// Optimized search function for fast client-side search
const searchPdfs = (pdfs, searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return [];

    const query = searchTerm.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(word => word.length > 0);

    return pdfs.filter(pdf => {
        // Create searchable text from title, category, description, and tags
        const searchableFields = [
            pdf.title || '',
            pdf.category || '',
            pdf.description || '',
            ...(Array.isArray(pdf.tags) ? pdf.tags : [])
        ];

        const searchText = searchableFields.join(' ').toLowerCase();

        // Check if all query words are found in the searchable text
        return queryWords.every(word => searchText.includes(word));
    }).sort((a, b) => {
        // Sort by relevance: exact title matches first, then other matches
        const aTitle = (a.title || '').toLowerCase();
        const bTitle = (b.title || '').toLowerCase();

        const aExactMatch = aTitle.includes(query);
        const bExactMatch = bTitle.includes(query);

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // Sort by title length (shorter titles first for exact matches)
        return aTitle.length - bTitle.length;
    });
};

// Enhanced fuzzy matching that includes category keywords
const calculatePdfCategoryMatchWithKeywords = (pdf, targetCategory) => {
    if (!pdf || !targetCategory || targetCategory === 'All') return 0;

    // Get base similarity score
    let maxScore = calculatePdfCategoryMatch(pdf, targetCategory);

    // Check against category keywords
    const keywords = categoryKeywords[targetCategory] || [];
    const pdfText = `${pdf.title || ''} ${pdf.description || ''} ${pdf.category || ''}`.toLowerCase();

    // Check keyword matches
    const keywordMatches = keywords.filter(keyword =>
        pdfText.includes(keyword.toLowerCase())
    ).length;

    if (keywordMatches > 0) {
        // Boost score based on keyword matches
        const keywordScore = Math.min(90, 40 + (keywordMatches * 15));
        maxScore = Math.max(maxScore, keywordScore);
    }

    return maxScore;
};

// Fuzzy matching function to calculate similarity percentage
const calculateSimilarity = (text1, text2) => {
    if (!text1 || !text2) return 0;

    const str1 = text1.toLowerCase().trim();
    const str2 = text2.toLowerCase().trim();

    if (str1 === str2) return 100;

    // Calculate Levenshtein distance
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    const maxLen = Math.max(len1, len2);
    const similarity = ((maxLen - matrix[len2][len1]) / maxLen) * 100;
    return Math.round(similarity);
};

// Enhanced fuzzy matching for PDF category filtering
const calculatePdfCategoryMatch = (pdf, targetCategory) => {
    if (!pdf || !targetCategory) return 0;

    const categoryLower = targetCategory.toLowerCase();
    const scores = [];

    // Check exact category match first (highest weight)
    if (pdf.category) {
        const categoryScore = calculateSimilarity(pdf.category, targetCategory);
        scores.push({ score: categoryScore, weight: 0.4 });
    }

    // Check title similarity (high weight)
    if (pdf.title) {
        const titleScore = Math.max(
            calculateSimilarity(pdf.title, targetCategory),
            pdf.title.toLowerCase().includes(categoryLower) ? 70 : 0
        );
        scores.push({ score: titleScore, weight: 0.3 });
    }

    // Check description similarity (medium weight)
    if (pdf.description) {
        const descScore = Math.max(
            calculateSimilarity(pdf.description, targetCategory),
            pdf.description.toLowerCase().includes(categoryLower) ? 60 : 0
        );
        scores.push({ score: descScore, weight: 0.2 });
    }

    // Check tags similarity (low weight)
    if (pdf.tags && Array.isArray(pdf.tags)) {
        const tagScores = pdf.tags.map(tag => calculateSimilarity(tag, targetCategory));
        const maxTagScore = Math.max(...tagScores, 0);
        scores.push({ score: maxTagScore, weight: 0.1 });
    }

    // Calculate weighted average
    const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0);
    const weightedSum = scores.reduce((sum, item) => sum + (item.score * item.weight), 0);

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
};

const Home = () => {
    const { trending, pdfs, loading } = usePdf();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [scrollY, setScrollY] = useState(0);
    
    // Ref for scrolling to results section
    const resultsRef = useRef(null);
    
    // Function to scroll to results
    const scrollToResults = () => {
        if (resultsRef.current) {
            // Try different scrolling approaches
            try {
                // Method 1: scrollIntoView
                resultsRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            } catch (error) {
                // Method 2: Get position and scroll manually
                const rect = resultsRef.current.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = rect.top + scrollTop - 100; // 100px offset from top
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            console.log('No ref found!'); // Debug log
        }
    };

    // Refs for scroll animations
    const heroRef = useRef(null);

    // Optimized search results using useMemo for performance
    const searchResults = useMemo(() => {
        return searchTerm.trim() ? searchPdfs(pdfs, searchTerm) : [];
    }, [pdfs, searchTerm]);

    // Enhanced scroll handler for layered effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setScrollY(scrollPosition);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe all elements with scroll-animate classes
        const animateElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
        animateElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [pdfs, trending, searchResults]); // Re-run when content changes

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is now handled automatically by useMemo when searchTerm changes
        // No need for API calls - everything is client-side for fast results
        
        // Scroll to results section
        if (searchTerm.trim()) {
            scrollToResults();
        }
    };

    // Handle category change
    const handleCategoryChange = (category) => {
        console.log('Category changed to:', category); // Debug log
        console.log('Current pdfs length:', pdfs.length); // Debug log
        setActiveCategory(category);
        // Clear search when changing categories
        if (searchTerm) {
            setSearchTerm('');
        }
    };

    // Clear search results when search term is cleared - now handled by useMemo
    // No need for separate useEffect as useMemo automatically recalculates

    // Enhanced fuzzy filtering with tag matching and 60% similarity threshold
    const filteredPdfs = useMemo(() => {
        console.log('Filtering PDFs:', { activeCategory, totalPdfs: pdfs.length });

        if (activeCategory === 'All') {
            console.log('Returning all PDFs:', pdfs.length);
            return pdfs;
        }

        const filtered = pdfs.filter((pdf) => {
            // Priority 1: Exact category match
            if (pdf.category === activeCategory) {
                console.log(`PDF "${pdf.title}" matched by exact category: ${pdf.category}`);
                return true;
            }

            // Priority 2: Direct tag match (case-insensitive)
            if (pdf.tags && Array.isArray(pdf.tags)) {
                const tagMatch = pdf.tags.some(tag =>
                    tag.toLowerCase().trim() === activeCategory.toLowerCase().trim()
                );
                if (tagMatch) {
                    console.log(`PDF "${pdf.title}" matched by tag: ${pdf.tags.join(', ')}`);
                    return true;
                }

                // Also check for partial tag matches (for compound categories like "AI/ML")
                const partialTagMatch = pdf.tags.some(tag => {
                    const tagLower = tag.toLowerCase().trim();
                    const categoryLower = activeCategory.toLowerCase().trim();

                    // Handle special cases like "AI/ML", "Web Development"
                    if (categoryLower.includes('/')) {
                        const categoryParts = categoryLower.split('/');
                        return categoryParts.some(part => tagLower.includes(part.trim()));
                    }

                    if (categoryLower.includes(' ')) {
                        const categoryWords = categoryLower.split(' ');
                        return categoryWords.some(word => tagLower.includes(word.trim()));
                    }

                    return tagLower.includes(categoryLower) || categoryLower.includes(tagLower);
                });

                if (partialTagMatch) {
                    console.log(`PDF "${pdf.title}" matched by partial tag: ${pdf.tags.join(', ')}`);
                    return true;
                }
            }

            // Priority 3: Enhanced fuzzy matching with keywords and 60% threshold
            const similarity = calculatePdfCategoryMatchWithKeywords(pdf, activeCategory);
            const matches = similarity >= 60;

            // Debug logging for fuzzy matching
            if (similarity > 30) {
                console.log(`PDF "${pdf.title}" vs "${activeCategory}": ${similarity}% similarity`, {
                    matches,
                    category: pdf.category,
                    title: pdf.title,
                    tags: pdf.tags,
                    matchType: matches ? 'fuzzy-match' : 'below-threshold'
                });
            }

            return matches;
        });

        console.log('Filtered PDFs result:', { activeCategory, filteredCount: filtered.length });
        return filtered;
    }, [pdfs, activeCategory]);

    // Debug logging - can be removed in production
    useEffect(() => {
        console.log('Category changed:', activeCategory, 'PDFs count:', filteredPdfs.length);
        console.log('Results ref current:', resultsRef.current); // Debug ref
    }, [activeCategory, filteredPdfs.length]);

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">

            {/* Fixed Hero Section */}
            <header
                ref={heroRef}
                className="fixed top-0 left-0 right-0 h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden z-0"
            >
                {/* Animated background elements */}
                <div
                    className="absolute inset-0 opacity-20 transition-transform duration-700"
                    style={{
                        transform: `translateY(${scrollY * 0.1}px) scale(${1 + scrollY * 0.0001})`,
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)'
                    }}
                ></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="text-center">

                        {/* Logo with animation */}
                        <div className="scroll-animate-scale inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>

                        {/* Title with animation */}
                        <h1 className="scroll-animate text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                            PDF<span className="text-blue-200">Hub</span>
                        </h1>

                        {/* Description with animation */}
                        <p className="scroll-animate stagger-1 text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Discover, learn, and excel with our comprehensive library of educational resources,
                            course materials, and professional references.
                        </p>

                        {/* Search Bar with animation */}
                        <div className="scroll-animate stagger-2 max-w-2xl mx-auto mb-8">
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(e);
                                            }
                                        }}
                                        placeholder="Search topics, resources, authors..."
                                        className="block w-full pl-12 pr-16 py-4 text-lg bg-white border-0 rounded-2xl shadow-lg focus:ring-4 focus:ring-white/30 focus:outline-none text-gray-900 placeholder-gray-500"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute inset-y-0 right-0 flex items-center pr-2"
                                        disabled={!searchTerm.trim()}
                                    >
                                        <div className={`text-white p-3 rounded-xl transition-all duration-200 shadow-lg ${searchTerm.trim()
                                            ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                                            : 'bg-gray-400 cursor-not-allowed'
                                            }`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Category Tags with staggered animation */}
                        <div className="scroll-animate stagger-3 flex flex-wrap justify-center gap-3">
                            {categories.map((category, index) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${activeCategory === category
                                        ? 'bg-white text-indigo-600 shadow-xl scale-105'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                    style={{
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>
            </header>

            {/* Spacer for fixed hero */}
            <div className="h-screen"></div>

            {/* Flowing Main Content */}
            <main
                ref={resultsRef}
                className="relative bg-white shadow-2xl rounded-t-2xl z-30 transform transition-all duration-300 ease-out"
                style={{
                    marginTop: `-${Math.min(scrollY * 0.2, 60)}px`,
                    transform: `translateY(-60px)`,
                    boxShadow: '0 -20px 50px rgba(0,0,0,0.15), 0 -40px 100px rgba(0,0,0,0.1)',
                    minHeight: 'calc(100vh)' // Ensure it covers at least 2 viewports
                }}
            >
                {/* Enhanced gradient overlay for smooth transition */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-white/80 to-white rounded-t-3xl"></div>

                {/* Content container with enhanced padding */}
                <div className="px-4 sm:px-6 lg:px-8 py-24 pb-96 space-y-20 relative z-10">{/* Added substantial bottom padding to prevent hero visibility */}

                    {/* Fixed Header with Search - Always Visible */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={searchTerm ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" : "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"} />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {searchTerm ? 'Search Results' : (activeCategory === 'All' ? 'All Resources' : `${activeCategory} Resources`)}
                                </h2>
                                <p className="text-gray-600">
                                    {searchTerm
                                        ? `Found ${searchResults.length} resources for "${searchTerm}"`
                                        : (activeCategory === 'All'
                                            ? 'Explore our complete collection'
                                            : (
                                                <span className="flex items-center gap-2">
                                                    {`Smart matching for ${activeCategory}`}
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        Multi-Layer Match
                                                    </span>
                                                </span>
                                            )
                                        )
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Fixed Search Input - Always Visible */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search PDFs..."
                                    className="w-64 pl-10 pr-12 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {/* Scroll to results button */}
                                <button
                                    onClick={() => {
                                        console.log('Button clicked!'); // Debug
                                        scrollToResults();
                                    }}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                                    title="Scroll to results"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </button>
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear Search
                                </button>
                            )}
                            {activeCategory !== 'All' && (
                                <button
                                    onClick={() => setActiveCategory('All')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchTerm && (
                        <section className="scroll-animate">
                            {searchResults.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
                                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                                        We couldn't find any resources matching "<span className="font-semibold">{searchTerm}</span>". Try adjusting your search terms.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                        }}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {searchResults.map((pdf, index) => (
                                        <div
                                            key={pdf._id}
                                            className={`scroll-animate stagger-${Math.min(index + 1, 6)}`}
                                        >
                                            <PdfCard pdf={pdf} size="small" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* All PDFs */}
                    {!searchTerm && (
                        <section className="scroll-animate">

                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        <div className="mt-6 text-center">
                                            <p className="text-lg font-medium text-gray-700">Loading PDFs</p>
                                            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the content...</p>
                                        </div>
                                    </div>
                                </div>
                            ) : filteredPdfs.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No resources available</h3>
                                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                                        {activeCategory !== 'All'
                                            ? `No resources found in the "${activeCategory}" category. Try selecting a different category.`
                                            : 'We\'re working on adding new content. Check back later!'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredPdfs.map((pdf, index) => {
                                            // Validate PDF data
                                            if (!pdf || !pdf._id) {
                                                console.warn(`PDF at index ${index} is missing required data:`, pdf);
                                                return (
                                                    <div key={`invalid-${index}`} style={{
                                                        padding: '10px',
                                                        border: '1px solid orange',
                                                        color: 'orange',
                                                        fontSize: '12px'
                                                    }}>
                                                        Invalid PDF data at index {index}
                                                    </div>
                                                );
                                            }

                                            try {
                                                return (
                                                    <div
                                                        key={pdf._id}
                                                        className="w-full"
                                                    >
                                                        <PdfCard pdf={pdf} size="small" />
                                                    </div>
                                                );
                                            } catch (error) {
                                                console.error(`Error rendering PDF at index ${index}:`, error, pdf);
                                                return (
                                                    <div key={`error-${index}`} style={{
                                                        padding: '10px',
                                                        border: '1px solid red',
                                                        color: 'red',
                                                        fontSize: '12px'
                                                    }}>
                                                        Error rendering PDF: {pdf?.title || 'Unknown'}<br />
                                                        Error: {error.message}
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                </div>
            </main>
            {/* Footer Section */}
            <footer className="relative bg-[#bedbff] -mt-20 pt-16 pb-8  z-[9999]">
                <div className='border-t h-2 py-5 border-gray-400 w-7xl m-auto'></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        {/* Brand Section */}
                        <div className="md:col-span-2">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-3">
                                    <img src={logo} className='w-full h-full' alt="logo" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">DikSuchi</h3>
                            </div>
                            <p className="text-gray-600 mb-4 max-w-md">
                                Your ultimate destination for high-quality educational resources. Discover, learn, and grow with our curated collection of PDFs.
                            </p>
                            <div className="flex items-center h-6 space-x-4">
                                <a href="https://www.youtube.com/@DiksuchiELearning" target='blank' className="text-red-700 hover:text-red-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6" role="img" aria-label="YouTube">
                                        <title>YouTube</title>
                                        <rect x="1" y="5" width="22" height="14" rx="4" fill="currentColor" />
                                        <path d="M10 8.5v7l6-3.5-6-3.5z" fill="#fff" />
                                    </svg>
                                </a>
                                <a href="https://whatsapp.com/channel/0029Vb6XokJG8l5Mw97gst0Q" target='blank' className="text-green-700 hover:text-green-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">All Resources</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Categories</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Search</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Popular</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Support</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm mb-4 md:mb-0">
                            © 2025 PDFhub. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;