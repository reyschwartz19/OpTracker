// Framer Motion animation presets
// Design principle: Purpose over playfulness. Every motion should explain state, progress, or feedback.

// Cubic bezier for easeOut: [0.33, 1, 0.68, 1]
// Cubic bezier for easeInOut: [0.65, 0, 0.35, 1]

export const fadeSlideIn = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.18, ease: [0.33, 1, 0.68, 1] as const },
}

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.16, ease: [0.33, 1, 0.68, 1] as const },
}

export const scaleIn = {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: 0.18, ease: [0.33, 1, 0.68, 1] as const },
}

export const slideFromRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.18, ease: [0.33, 1, 0.68, 1] as const },
}

export const slideFromBottom = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.22, ease: [0.33, 1, 0.68, 1] as const },
}

// Button press animation
export const buttonTap = {
    whileTap: { scale: 0.97 },
    transition: { duration: 0.12 },
}

// Card hover animation (web only)
export const cardHover = {
    whileHover: { y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' },
    transition: { duration: 0.16 },
}

// Stagger children animation
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
}

export const staggerItem = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
}

// Tab underline animation
export const tabUnderline = {
    layoutId: 'tab-underline',
    transition: { duration: 0.16, ease: [0.65, 0, 0.35, 1] as const },
}

// Progress bar animation
export const progressBar = (width: number) => ({
    initial: { width: 0 },
    animate: { width: `${width}%` },
    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] as const },
})

// Tooltip animation
export const tooltip = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.12, ease: [0.33, 1, 0.68, 1] as const },
}
