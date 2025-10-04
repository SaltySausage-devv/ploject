import { animate, stagger, spring } from 'animejs'

export function useScrollAnimations() {
  const setupScrollAnimations = () => {
    // Create intersection observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target
          const animationType = element.dataset.animation

          switch (animationType) {
            case 'fadeInUp':
              animate(element, {
                keyframes: [
                  { opacity: 0, y: 50, ease: 'outExpo', duration: 0 },
                  { opacity: 1, y: 0, ease: 'outBack', duration: 800 }
                ],
                duration: 800
              })
              break

            case 'fadeInLeft':
              animate(element, {
                keyframes: [
                  { opacity: 0, x: -50, ease: 'outExpo', duration: 0 },
                  { opacity: 1, x: 0, ease: 'outBack', duration: 600 }
                ],
                duration: 600
              })
              break

            case 'fadeInRight':
              animate(element, {
                keyframes: [
                  { opacity: 0, x: 50, ease: 'outExpo', duration: 0 },
                  { opacity: 1, x: 0, ease: 'outBack', duration: 600 }
                ],
                duration: 600
              })
              break

            case 'scaleIn':
              animate(element, {
                keyframes: [
                  { scale: 0, opacity: 0, ease: 'outExpo', duration: 0 },
                  { scale: 1.1, opacity: 1, ease: 'outBack', duration: 400 },
                  { scale: 1, ease: spring({ bounce: 0.4 }), duration: 300 }
                ],
                duration: 700
              })
              break

            case 'rotateIn':
              animate(element, {
                keyframes: [
                  { rotate: -180, scale: 0, opacity: 0, ease: 'outExpo', duration: 0 },
                  { rotate: 0, scale: 1, opacity: 1, ease: 'outBack', duration: 800 }
                ],
                duration: 800
              })
              break

            case 'slideInStagger':
              const children = element.querySelectorAll('[data-stagger-item]')
              animate(children, {
                keyframes: [
                  { opacity: 0, y: 30, scale: 0.9, ease: 'outExpo', duration: 0 },
                  { opacity: 1, y: 0, scale: 1.05, ease: 'outBack', duration: 400 },
                  { scale: 1, ease: 'outElastic', duration: 200 }
                ],
                delay: stagger(100),
                duration: 600
              })
              break

            case 'bounceIn':
              animate(element, {
                keyframes: [
                  { scale: 0, y: -100, ease: 'outExpo', duration: 0 },
                  { scale: 1.2, y: 0, ease: 'outBack', duration: 500 },
                  { scale: 1, ease: spring({ bounce: 0.6 }), duration: 300 }
                ],
                duration: 800
              })
              break

            case 'flipIn':
              animate(element, {
                keyframes: [
                  { rotateY: -90, opacity: 0, ease: 'outExpo', duration: 0 },
                  { rotateY: 0, opacity: 1, ease: 'outBack', duration: 600 }
                ],
                duration: 600
              })
              break

            case 'zoomIn':
              animate(element, {
                keyframes: [
                  { scale: 0.3, opacity: 0, ease: 'outExpo', duration: 0 },
                  { scale: 1.1, opacity: 1, ease: 'outBack', duration: 500 },
                  { scale: 1, ease: 'outElastic', duration: 300 }
                ],
                duration: 800
              })
              break

            case 'slideUp':
              animate(element, {
                keyframes: [
                  { y: 100, opacity: 0, ease: 'outExpo', duration: 0 },
                  { y: 0, opacity: 1, ease: 'outCubic', duration: 700 }
                ],
                duration: 700
              })
              break

            case 'typewriter':
              const text = element.textContent
              element.textContent = ''
              element.style.opacity = '1'
              
              let i = 0
              const typeInterval = setInterval(() => {
                element.textContent += text.charAt(i)
                i++
                if (i > text.length) {
                  clearInterval(typeInterval)
                }
              }, 50)
              break

            default:
              // Default fade in animation
              animate(element, {
                opacity: [0, 1],
                y: [30, 0],
                duration: 600,
                ease: 'outExpo'
              })
          }

          // Unobserve after animation to prevent re-triggering
          observer.unobserve(element)
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    // Observe all elements with data-animation attribute
    const animatedElements = document.querySelectorAll('[data-animation]')
    animatedElements.forEach(element => {
      observer.observe(element)
    })

    return observer
  }

  const createParticleEffect = (element) => {
    const particles = []
    const particleCount = 20

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.style.position = 'absolute'
      particle.style.width = '4px'
      particle.style.height = '4px'
      particle.style.background = i % 2 === 0 ? '#ff8c42' : '#ffd23f'
      particle.style.borderRadius = '50%'
      particle.style.pointerEvents = 'none'
      particle.style.zIndex = '1000'
      particle.style.boxShadow = '0 0 8px ' + (i % 2 === 0 ? '#ff8c42' : '#ffd23f')
      particle.style.opacity = '0.8'
      
      const rect = element.getBoundingClientRect()
      particle.style.left = rect.left + rect.width / 2 + 'px'
      particle.style.top = rect.top + rect.height / 2 + 'px'
      
      document.body.appendChild(particle)
      particles.push(particle)

      // Animate particle
      animate(particle, {
        keyframes: [
          { 
            scale: 0, 
            opacity: 1, 
            x: 0, 
            y: 0, 
            ease: 'outExpo', 
            duration: 0 
          },
          { 
            scale: 1, 
            x: (Math.random() - 0.5) * 200, 
            y: (Math.random() - 0.5) * 200, 
            ease: 'outBack', 
            duration: 600 
          },
          { 
            scale: 0, 
            opacity: 0, 
            ease: 'outExpo', 
            duration: 400 
          }
        ],
        duration: 1000,
        delay: i * 20
      }).then(() => {
        document.body.removeChild(particle)
      })
    }
  }

  const setupParallaxEffect = () => {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset
      const parallaxElements = document.querySelectorAll('[data-parallax]')
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5
        const yPos = -(scrolled * speed)
        element.style.transform = `translateY(${yPos}px)`
      })
    })
  }

  const setupMagneticEffect = (element) => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      animate(element, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 300,
        ease: 'outCubic'
      })
    })

    element.addEventListener('mouseleave', () => {
      animate(element, {
        x: 0,
        y: 0,
        duration: 500,
        ease: 'outElastic'
      })
    })
  }

  return {
    setupScrollAnimations,
    createParticleEffect,
    setupParallaxEffect,
    setupMagneticEffect
  }
}
