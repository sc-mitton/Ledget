
import React from 'react'
import Image from 'next/image'
import ledgetLogo from '@/assets/logo.svg'
import styles from '@/styles/Layout.module.scss'


const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <header>
                <div className={styles.header}>
                    <div>
                        <div className={styles.logo}>
                            <Image src={ledgetLogo} alt="Ledget Logo" height={24} />
                        </div>
                    </div>
                    <div>
                        <nav>
                            <ul>
                                <li>
                                    <a href="#">FAQ</a>
                                </li>
                            </ul>
                        </nav>
                        <div>
                            <a href="/">
                                <button className={`${styles.authbutton}`}>
                                    <span>Sign In</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20">
                                        <path d="M5 10L13.125 10" stroke="black" stroke-width="1.25"
                                            stroke-linecap="round" stroke-linejoin="round" fill="none" />
                                        <path d="M8 14L12 10" stroke="black" stroke-width="1.25"
                                            stroke-linecap="round" stroke-linejoin="round" fill="none" />
                                        <path d="M12 10L8 6" stroke="black" stroke-width="1.25"
                                            stroke-linecap="round" stroke-linejoin="round" fill="none" />
                                    </svg>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            {children}
        </>
    )
}

export default Layout
