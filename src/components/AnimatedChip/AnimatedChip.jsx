// AnimatedChip.jsx
import React from 'react';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types'; // For prop type validation

// Importing the animations
import fireAnimation from '../../assets/animations/fire.json';
import showAnimation from '../../assets/animations/snow.json'; // Beginner animation
import lightingAnimation from '../../assets/animations/lighting.json'; // Advanced animation

const AnimatedChip = ({
    label = 'N/A', // Default label
    textColor = '#fff',
    width = 120,
    height = 30,
}) => {
    // Initialize variables
    let animationData = fireAnimation; // Default to intermediate
    let backgroundColor = null; // Default color for intermediate
    let boxShadow = '0px 4px 10px rgba(230, 126, 34, 0.5)'; // Default shadow for intermediate
    let preserveAspectRatio = 'xMidYMid meet'; // Default preserveAspectRatio
    // Conditional logic to select animation, color, boxShadow, and preserveAspectRatio based on label
    if (label.toLowerCase() === 'beginner') {
        animationData = showAnimation;
        backgroundColor = '#3498db'; // Blue for beginner
        boxShadow = '0px 4px 10px rgba(52, 152, 219, 0.5)';
        preserveAspectRatio = 'xMidYMax slice';
    } else if (label.toLowerCase() === 'advanced') {
        animationData = lightingAnimation;
        backgroundColor = '#9b59b6'; // Purple for advanced
        boxShadow = '0px 4px 10px rgba(155, 89, 182, 0.5)';
        preserveAspectRatio = 'xMidYMid slice';
    } else if (label.toLowerCase() === 'intermediate') {
        animationData = fireAnimation;
        backgroundColor = '#e67e22'; // Orange for intermediate
        boxShadow = '0px 4px 10px rgba(230, 126, 34, 0.5)';
        preserveAspectRatio = 'xMidYMax slice';
    } else {
        // Handle unexpected labels
        animationData = showAnimation; // Default to beginner animation
        backgroundColor = '#95a5a6'; // Neutral gray
        boxShadow = '0px 4px 10px rgba(149, 165, 166, 0.5)';
        preserveAspectRatio = 'xMidYMid meet';
    }

    // Lottie configuration options
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: preserveAspectRatio, // Dynamic based on skill level
        },
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return ''; // Handle null, undefined, or empty strings
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    // Capitalize the label
    const displayLabel = capitalizeFirstLetter(label);

    return (
        <div style={styles.chipContainer(backgroundColor, boxShadow, width, height)}>
            {/* Lottie Animation */}
            <div style={styles.animationContainer}>
                <Lottie
                    options={defaultOptions}
                    height={height} // Match the chip height
                    width={width}   // Match the chip width
                    isClickToPauseDisabled
                />
            </div>

            {/* Label Text */}
            <span style={styles.labelText(textColor)}>
                {displayLabel}
            </span>
        </div>
    );
};

// Define prop types for better type checking
AnimatedChip.propTypes = {
    label: PropTypes.string.isRequired,
    textColor: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
};

// Inline CSS styles
const styles = {
    chipContainer: (backgroundColor, boxShadow, width, height) => ({
        position: 'relative', // Establishes positioning context
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,             // Chip width
        height: height,           // Chip height
        borderRadius: '15px',     // Rounded for a pill shape
        boxShadow: boxShadow,     // Dynamic boxShadow based on skill level
        cursor: 'default',
        transition: 'background-color 0.3s, box-shadow 0.3s',
        overflow: 'hidden',       // Clips the animation to the chip boundaries
        margin: '4px',            // Optional: Space between multiple chips
        backgroundColor: backgroundColor, // Dynamic background color
    }),
    animationContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none', // Allows clicks to pass through to underlying elements
        opacity: '0.9'
    },
    labelText: (color) => ({
        position: 'relative',
        zIndex: 1, // Ensures text is above the animation
        color: color,
        fontWeight: 'bold',
        fontSize: '14px', // Adjust font size as needed
        textAlign: 'center',
    }),
};

export default AnimatedChip;
