import { animate, stagger, spring, utils } from 'animejs'

export function useAnimatedBackground() {
  let backgroundElements = []
  let animations = []
  let preventOverScroll = null

  const createFloatingStudyElements = () => {
    const container = document.createElement('div')
    container.className = 'animated-background'
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    `
    document.body.appendChild(container)

    // Create floating study elements (optimized for performance)
    for (let i = 0; i < 10; i++) {
      const element = document.createElement('div')
      element.className = 'floating-study-element'
      
      const size = utils.random(50, 100)
      const elementType = Math.random()
      
      // Create different study elements with more variety
      if (elementType < 0.15) {
        // Book
        element.innerHTML = '📚'
        element.style.fontSize = `${size}px`
      } else if (elementType < 0.25) {
        // Pencil
        element.innerHTML = '✏️'
        element.style.fontSize = `${size}px`
      } else if (elementType < 0.35) {
        // Notebook
        element.innerHTML = '📝'
        element.style.fontSize = `${size}px`
      } else if (elementType < 0.45) {
        // Calculator
        element.innerHTML = '🧮'
        element.style.fontSize = `${size}px`
      } else if (elementType < 0.55) {
        // Globe
        element.innerHTML = '🌍'
        element.style.fontSize = `${size}px`
      } else if (elementType < 0.65) {
        // Graduation Cap
        element.innerHTML = '🎓'
        element.style.fontSize = `${size}px`
      } else if (elementType < 0.75) {
        // Microscope
        element.innerHTML = '🔬'
        element.style.fontSize = `${size}px`
      } else if (elementType < 0.85) {
        // Light Bulb
        element.innerHTML = '💡'
        element.style.fontSize = `${size}px`
      } else if (elementType < 0.95) {
        // Mathematical Symbol
        const symbols = ['π', '∑', '∞', '+', '=', '∫', '∆', '√']
        element.innerHTML = symbols[Math.floor(Math.random() * symbols.length)]
        element.style.fontSize = `${size}px`
        element.style.fontFamily = 'serif'
      } else {
        // Question Mark
        element.innerHTML = '❓'
        element.style.fontSize = `${size}px`
      }
      
      element.style.cssText += `
        position: absolute;
        left: ${utils.random(0, 100)}%;
        top: ${utils.random(0, 100)}%;
        transform: rotate(${utils.random(0, 360)}deg);
        opacity: 0.6;
        filter: grayscale(100%) brightness(1.3) contrast(0.7);
        text-shadow: 0 0 15px rgba(200, 200, 200, 0.5);
        pointer-events: none;
        z-index: 1;
      `
      
      container.appendChild(element)
      backgroundElements.push(element)
    }
  }


  const createGridPattern = () => {
    const container = document.querySelector('.animated-background')
    if (!container) return

    const grid = document.createElement('div')
    grid.className = 'animated-grid'
    
    grid.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 140, 66, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 140, 66, 0.3) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.6;
      filter: blur(0.5px);
    `
    
    container.appendChild(grid)
    backgroundElements.push(grid)
  }


  const animateFloatingStudyElements = () => {
    const elements = document.querySelectorAll('.floating-study-element')
    console.log('Found floating study elements:', elements.length)
    
    elements.forEach((element, index) => {
      try {
        const animation = animate(element, {
        keyframes: [
          { 
            translateX: utils.random(-30, 30),
            translateY: utils.random(-20, 20),
            rotate: utils.random(0, 90),
            scale: utils.random(0.95, 1.05),
            opacity: utils.random(0.5, 0.7),
            ease: 'inOutSine',
            duration: utils.random(3000, 5000)
          },
          { 
            translateX: utils.random(-30, 30),
            translateY: utils.random(-20, 20),
            rotate: utils.random(0, 90),
            scale: utils.random(0.95, 1.05),
            opacity: utils.random(0.5, 0.7),
            ease: 'inOutSine',
            duration: utils.random(3000, 5000)
          }
        ],
          delay: index * 100,
          loop: true,
          duration: 6000
        })
        
        animations.push(animation)
      } catch (error) {
        console.error('Error animating shape:', error)
      }
    })
  }



  const animateGrid = () => {
    const grid = document.querySelector('.animated-grid')
    if (!grid) return

    const animation = animate(grid, {
      keyframes: [
        { 
          opacity: 0.2,
          ease: 'inOutSine',
          duration: 4000
        },
        { 
          opacity: 0.4,
          ease: 'inOutSine',
          duration: 4000
        }
      ],
      loop: true,
      duration: 8000
    })
    
    animations.push(animation)
  }



  const initAnimatedBackground = () => {
    console.log('Initializing cyberpunk animated background...')
    
    // Clean up existing background
    cleanup()
    
    // Prevent over-scrolling
    document.body.style.overscrollBehavior = 'none'
    document.documentElement.style.overscrollBehavior = 'none'
    
    // Add scroll prevention
    preventOverScroll = (e) => {
      if (window.scrollY <= 0 && e.deltaY < 0) {
        e.preventDefault()
      }
    }
    
    window.addEventListener('wheel', preventOverScroll, { passive: false })
    window.addEventListener('touchmove', preventOverScroll, { passive: false })
    
    // Create background container
    const container = document.createElement('div')
    container.className = 'animated-background'
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      background-attachment: fixed;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      min-height: 100vh;
      min-width: 100vw;
    `
    document.body.appendChild(container)
    
    // Create simplified background elements (reduced for performance)
    createFloatingStudyElements()
    createGridPattern()
    
    // Start simplified animations with a small delay to ensure elements are created
    setTimeout(() => {
      console.log('Starting simplified cyberpunk animations...')
      animateFloatingStudyElements()
      animateGrid()
    }, 200)
  }

  const cleanup = () => {
    // Stop all animations
    animations.forEach(animation => {
      if (animation && typeof animation.cancel === 'function') {
        animation.cancel()
      }
    })
    animations = []
    
    // Remove all background elements
    const existingBackground = document.querySelector('.animated-background')
    if (existingBackground) {
      existingBackground.remove()
    }
    backgroundElements = []
    
    // Remove scroll prevention
    if (preventOverScroll) {
      window.removeEventListener('wheel', preventOverScroll)
      window.removeEventListener('touchmove', preventOverScroll)
    }
  }

  const pauseAnimations = () => {
    animations.forEach(animation => {
      if (animation && typeof animation.pause === 'function') {
        animation.pause()
      }
    })
  }

  const resumeAnimations = () => {
    animations.forEach(animation => {
      if (animation && typeof animation.play === 'function') {
        animation.play()
      }
    })
  }

  return {
    initAnimatedBackground,
    cleanup,
    pauseAnimations,
    resumeAnimations
  }
}
