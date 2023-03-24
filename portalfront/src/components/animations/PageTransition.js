import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const variants = {
    enter: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeInOut" }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.5, ease: "easeInOut" }
    },
    flipLeft: {
        rotateY: 180,
        x: "-100%",
        transition: { duration: 0.5, ease: "easeInOut" }
    },
    flipRight: {
        rotateY: 180,
        x: "100%",
        transition: { duration: 0.5, ease: "easeInOut" }
    }
};

const Page1 = ({ setPage }) => {
    return (
        <motion.div
            className="page"
            initial="enter"
            animate="enter"
            exit="flipLeft"
            variants={variants}
        >
            <h1>Page 1</h1>
            <button onClick={() => setPage(2)}>Go to Page 2</button>
        </motion.div>
    );
};

const Page2 = ({ setPage }) => {
    return (
        <motion.div
            className="page"
            initial="flipRight"
            animate="enter"
            exit="flipRight"
            variants={variants}
        >
            <h1>Page 2</h1>
            <button onClick={() => setPage(1)}>Go to Page 1</button>
        </motion.div>
    );
};

const Flipbook = () => {
    const [page, setPage] = useState(1);

    useEffect(() => {
        document.body.classList.add("no-scroll");

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

    return (
        <div className="flipbook">
            <AnimatePresence initial={false} exitBeforeEnter>
                {page === 1 && <Page1 setPage={setPage} key="page1" />}
                {page === 2 && <Page2 setPage={setPage} key="page2" />}
            </AnimatePresence>
        </div>
    );
};
