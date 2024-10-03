import React, { useState, useEffect } from 'react';
import './game.css'; 


import area from '../moves/area.png';
import background from '../moves/background.png';
import dock4 from '../moves/dock-4.png';
import idle1 from '../moves/idle-1.png';
import jump1 from '../moves/jump-1.png';
import jump2 from '../moves/jump-2.png';
import jump3 from '../moves/jump-3.png';
import jump4 from '../moves/jump-4.png';
import jump5 from '../moves/jump-5.png';
import jump6 from '../moves/jump-6.png';
import jump7 from '../moves/jump-7.png';
import left1 from '../moves/left-1.png';
import left2 from '../moves/left-2.png';
import left3 from '../moves/left-3.png';
import left4 from '../moves/left-4.png';
import bullet_v from '../moves/bullet_v.png'
import left6 from '../moves/left-6.png';
import right1 from '../moves/right-1.png';
import right2 from '../moves/right-2.png';
import right3 from '../moves/right-3.png';
import right4 from '../moves/right-4.png';
import right5 from '../moves/right-5.png';
import bullet_h from '../moves/bullet_h.png'

const Game = () => {
  const [characterState, setCharacterState] = useState('idle'); // Track the current state
  const [position, setPosition] = useState({ x: 50, y: 50 });  // Character's position
  const [health, setHealth] = useState(10);  // Health state
  const [isJumping, setIsJumping] = useState(false);
  const [jumpFrame, setJumpFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isDocking, setIsDocking] = useState(false); 
  const [leftFrame, setLeftFrame] = useState(0);
  const [rightFrame, setRightFrame] = useState(0);
  const [isFalling, setIsFalling] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [horizontalBulletPosition, setHorizontalBulletPosition] = useState({ x: -10, y: Math.random() * 100 }); // Start off-screen
  const [bulletPosition, setBulletPosition] = useState({ x: 50, y: -10 }); 

  
const renderBullet = () => (
    <img
      src={bullet_v} 
      alt="Bullet"
      className="bullet" 
      style={{
        position: 'absolute',
        top: `${bulletPosition.y}%`,
        left: `${bulletPosition.x}%`,
        width: '20px', // Adjustable size 
        height: '20px',
      }}
    />
  );

  const renderHorizontalBullet = () => (
    <img
      src={bullet_h} 
      alt="Horizontal Bullet"
      className="horizontal-bullet" 
      style={{
        position: 'absolute',
        top: `${horizontalBulletPosition.y}%`,
        left: `${horizontalBulletPosition.x}%`,
        width: '20px', // Adjust here
        height: '20px',
      }}
    />
  );

  useEffect(() => {
    if (!isGameOver) {
      const horizontalBulletInterval = setInterval(() => {
        setHorizontalBulletPosition((prev) => {
          const newX = prev.x - 5; // left
          if (newX < -10) { // Reset 
            return { x: 100, y: Math.random() * 100 }; // Start from the right side
          }
          return { x: newX, y: prev.y };
        });
      }, 50); // Speed of horizontal bullet 
  
      return () => clearInterval(horizontalBulletInterval);
    }
  }, [isGameOver]);

    
    const handleRestart = () => {
        window.location.reload(); 
    };

  const platformBounds = {
    left: 40,  
    right: 60, 
    top: 70,   
  };
  const jumpImages = [jump1, jump2, jump3, jump4, jump5, jump6, jump7];

  // Use effect to start bullet movement
useEffect(() => {
    if (!isGameOver) {
      const bulletInterval = setInterval(() => {
        setBulletPosition((prev) => {
          const newY = prev.y + 5; // Move down the screen
          if (newY > 100) {
            return { x: Math.random() * 100, y: -10 }; // Reset bullet position when it goes off screen
          }
          return { x: prev.x, y: newY };
        });
      }, 50); // Speed of bullet movement
  
      return () => clearInterval(bulletInterval);
    }
  }, [isGameOver]);


  useEffect(() => {
    // Check if the character is outside platform boundaries
    if ((position.x < platformBounds.left || position.x > platformBounds.right) && !isFalling) {
      setIsFalling(true); // Trigger fall when moving out of platform horizontally
      setCharacterState('fall');
    }
  
    // Ensure the character stays on top of the platform when not falling
    if (position.y > platformBounds.top && !isFalling) {
      setIsFalling(true); // Trigger fall when moving below platform vertically
      setCharacterState('fall');
    }
  }, [position, isFalling]);
  useEffect(() => {
    if (isFalling) {
      const fallInterval = setInterval(() => {
        setPosition((prev) => {
            const newY = Math.min(prev.y + 2, 90); // Stop falling at 90% (bottom of the app)
            return { ...prev, y: newY };
          });
      }, 25); // Speed of falling
  
      // Stop falling once the character reaches the bottom (y = 100)
      if (position.y >= 100) {
        clearInterval(fallInterval);
        // Trigger game over or any other logic you want to handle after the fall
        console.log("Game Over"); // Placeholder for game-over logic
      }
  
      return () => clearInterval(fallInterval);
    }
  }, [isFalling, position.y]);

  useEffect(() => {
    // Check if the character has fallen off the platform
    if (position.y >= 90 && isFalling) {
      setIsGameOver(true);  // Trigger game over
    }
    // Collision detection between the character and the bullet
    if (
      bulletPosition.y >= position.y &&
      bulletPosition.y <= position.y + 20 && // Adjust based on character's height
      bulletPosition.x >= position.x &&
      bulletPosition.x <= position.x + 10 // Adjust based on character's width
    ) {
        setHealth((prev) => {
            const newHealth = Math.max(prev - 1, 0);
            if (newHealth === 0) {
              setIsGameOver(true); // Set game over when health is zero
            }
            return newHealth;
          });
      setBulletPosition({ x: Math.random() * 100, y: -10 });
    }
  // Collision detection between the character and the horizontal bullet
  if (
    horizontalBulletPosition.y >= position.y &&
    horizontalBulletPosition.y <= position.y + 20 &&
    horizontalBulletPosition.x >= position.x &&
    horizontalBulletPosition.x <= position.x + 10
  ) {
    // Decrease health and reset horizontal bullet position
    setHealth((prev) => {
      const newHealth = Math.max(prev - 1, 0);
      if (newHealth === 0) {
        setIsGameOver(true);
      }
      return newHealth;
    });
    setHorizontalBulletPosition({ x: -10, y: Math.random() * 100 }); // Reset horizontal bullet position
  }
}, [position, bulletPosition, horizontalBulletPosition, isFalling]);

  useEffect(() => {
    if (characterState === 'left') {
      const leftImages = [left1, left2, left3, left4, left6];
      
      const leftAnimation = setInterval(() => {
        setLeftFrame((prevFrame) => (prevFrame + 1) % leftImages.length);
      }, 50); // Adjust the interval for smoother animation

      return () => clearInterval(leftAnimation);
    }
  }, [characterState]);

  useEffect(() => {
    if (characterState === 'right') {
      const rightImages = [right1, right2, right3, right4, right5];
      
      const rightAnimation = setInterval(() => {
        setRightFrame((prevFrame) => (prevFrame + 1) % rightImages.length);
      }, 50); // Adjust the interval for smoother animation

      return () => clearInterval(rightAnimation);
    }
  }, [characterState]);








  // Handle jump animation using multiple frames
  useEffect(() => {
    if (isJumping) {
      const jumpAnimation = setInterval(() => {
        setJumpFrame((prevFrame) => (prevFrame + 1) % jumpImages.length);
      }, 50); // Change jump image every 100ms

      // After cycling through jump images, stop the jump
      setTimeout(() => {
        clearInterval(jumpAnimation);
        setIsJumping(false);
        setJumpFrame(0); // Reset to idle after jumping
        setCharacterState('idle'); // Return to idle after jump ends
      }, jumpImages.length * 50); // Jump ends after all frames play

      return () => clearInterval(jumpAnimation); // Cleanup interval on unmount
    }
  }, [isJumping]);

  useEffect(() => {
    if (isDocking) {
      setCharacterState('dock'); // Set state to dock when S is pressed
    }
  }, [isDocking]);

  // Handle key press events for movement and jumping
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (isFalling) return; // Prevent any movement during fall
      
        switch (e.key.toLowerCase()) {
          case 'a': // Move left
            setPosition((prev) => ({
              ...prev,
              x: Math.max(prev.x - 5, 0),  // Prevent moving out of bounds (left)
            }));
            setCharacterState('left');
            setIsMoving(true);
            break;
      
          case 'd': // Move right
            setPosition((prev) => ({
              ...prev,
              x: Math.min(prev.x + 5, 100),  // Prevent moving out of bounds (right)
            }));
            setCharacterState('right');
            setIsMoving(true);
            break;
      
          case 'w': // Jump
            if (!isJumping) {
              setIsJumping(true);  // Trigger the jump animation
              setCharacterState('jump');
              setPosition((prev) => ({
                ...prev,
                y: Math.max(prev.y - 20, 0),  // Ensure jump doesn't move out of bounds (top)
              }));
              setTimeout(() => {
                setPosition((prev) => ({
                  ...prev,
                  y: Math.min(prev.y + 20, 100),  // Ensure character comes back down within bounds
                }));
              }, 500); // Simulate jumping and landing
            }
            break;
      
          case 's': // Dock (crouch)
            setIsDocking(true);  // Trigger the dock animation
            break;
      
          default:
            break;
        }
      };

    const handleKeyUp = (e) => {
        if (e.key.toLowerCase() === 's') {
          setIsDocking(false); // Reset dock state when S is released
        }
      
        if (!isJumping && !isMoving && !isDocking && !isFalling) {
          setCharacterState('idle'); // Reset to idle state when no key is pressed
        }
        setIsMoving(false);
      };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping, isMoving, isDocking]);

  // Idle animation logic: Toggle between two idle states
  useEffect(() => {
    const idleInterval = setInterval(() => {
      setCharacterState((prevState) => (prevState === 'idle1' ? 'idle2' : 'idle1'));
    }, 500); // Change every 500ms

    return () => clearInterval(idleInterval);
  }, []);

  // Render the character based on its current state
  const renderCharacter = () => {
    if (characterState === 'left') {
      const leftImages = [left1, left2, left3, left4, left6];
      return <img src={leftImages[leftFrame]} alt="Move Left" className="character" />;
    }
    if (characterState === 'right') {
      const rightImages = [right1, right2, right3, right4, right5];
      return <img src={rightImages[rightFrame]} alt="Move Right" className="character" />;
    }
    if (characterState === 'jump') {
      const jumpImages = [jump1, jump2, jump3, jump4, jump5, jump6, jump7];
      return <img src={jumpImages[jumpFrame]} alt="Jumping" className="character" />;
    }
    if (characterState === 'dock') {
        return (
          <img 
            src={dock4} 
            alt="Crouching" 
            className="character" 
            style={{ height: '40%', width: 'auto', position: 'relative', top: '20%' }} // Adjust top position to keep the character grounded
          />
        );
      }
      if (characterState === 'fall') {
        return (
          <img 
            src={idle1} // Use idle image or any other existing image during the fall
            alt="Falling"
            className="character"
            style={{ position: 'absolute', top: `${position.y}%`, left: `${position.x}%` }} // Update position while falling
          />
        );
      }
      
      
    return <img src={idle1} alt="Idle" className="character" />;
  };

  const renderGameOver = () => (
    <div className="game-over-screen">
      <h1>Game Over</h1>
      <button onClick={handleRestart}>Restart</button>
    </div>
  );

  return (
    <div className="game-container">
    {isGameOver ? (
  renderGameOver()
) : (
  <>
    <div className="background">
      <img src={background} alt="Background" className="background-image" />
      <img src={area} alt="Area Platform" className="platform" />
      <div className="character-container" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
        {renderCharacter()}
      </div>
      {renderBullet()} {/* Render the vertical bullet */}
      {renderHorizontalBullet()} {/* Render the horizontal bullet */}
    </div>
    <div className="health-bar">
      <div className="health" style={{ width: `${health * 10}%` }}></div>
    </div>
  </>
)}
  </div>
  );
};

export default Game;
