// AnimatedChip.jsx
import React from 'react';
import Lottie from 'react-lottie';
import fireAnimation from '../../assets/animations/fire.json'; // Adjust the path as needed

const AnimatedChip = ({
  label,
  animationData = fireAnimation,
  color = '#FF5733',
  textColor = '#fff',
  width = 120,
  height = 30,
}) => {
  // Lottie configuration options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMax slice",
    },
  };

  return (
    <div style={styles.chipContainer(color, width, height)}>
      {/* Lottie Animation */}
      <div style={styles.animationContainer}>
        <Lottie 
          options={defaultOptions} 
          height={height} // Match the chip height
          width={width}   // Match the chip width
          isClickToPauseDisabled 
          style={{ opacity: 0.9 }} // Adjust opacity as needed
        />
      </div>

      {/* Label Text */}
      <span style={styles.labelText(textColor)}>
        {label}
      </span>
    </div>
  );
};

// Inline CSS styles
const styles = {
  chipContainer: (backgroundColor, width, height) => ({
    position: 'relative', // Establishes positioning context
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,             // Chip width
    height: height,           // Chip height
    borderRadius: '25px',     // Fully rounded for a pill shape
    boxShadow: '0px 4px 10px rgba(255, 87, 51, 0.5)', // Optional: Enhanced shadow
    cursor: 'default',
    transition: 'background-color 0.3s',
    overflow: 'hidden',       // Clips the animation to the chip boundaries
    margin: '4px',            // Optional: Space between multiple chips
  }),
  animationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none', // Allows clicks to pass through to underlying elements
    // Optional: Add a semi-transparent overlay for better text readability
    /* 
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    */
  },
  labelText: (color) => ({
    position: 'relative',
    zIndex: 1, // Ensures text is above the animation
    color: color,
    fontWeight: 'bold',
    fontSize: '16px', // Adjust font size as needed
    textAlign: 'center',
  }),
};

export default AnimatedChip;
