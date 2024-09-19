import React, { ReactNode, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedDivProps {
    children: ReactNode;
    className?: string;
    direction?: "top" | "bottom" | "left" | "right";
    delay?: number;
    duration?: number;
}

const AnimatedDiv: React.FC<AnimatedDivProps> = memo(
    ({
        children,
        className = "",
        direction = "top",
        delay = 0.1,
        duration = 0.5,
    }) => {
        const variants = {
            top: { opacity: 0, y: -40 },
            bottom: { opacity: 0, y: 40 },
            left: { opacity: 0, x: -40 },
            right: { opacity: 0, x: 40 },
        };

        const animateDirection = {
            top: { opacity: 1, y: 0 },
            bottom: { opacity: 1, y: 0 },
            left: { opacity: 1, x: 0 },
            right: { opacity: 1, x: 0 },
        };

        return (
            <AnimatePresence>
                <motion.div
                    initial={variants[direction]}
                    animate={animateDirection[direction]}
                    transition={{
                        delay,
                        duration,
                        ease: "easeInOut",
                    }}
                    exit={variants[direction]}
                    className={className}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        );
    }
);

export default AnimatedDiv;
