"use client";

import Link from "next/link";
import * as React from "react";
import { Loader } from "./Loader";

type Variant = "primary" | "outlineWhite" | "ghost";

export function ButtonBase({
    children,
    className = "",
    href,
    onClick,
    type = "button",
    variant = "primary",
    disabled,
    isLoading,
}: {
    children: React.ReactNode;
    className?: string;
    href?: string;
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: Variant;
    disabled?: boolean;
    isLoading?: boolean;
}) {

    const cls = `flex flex-1 bg-[#045830] text-white font-semibold font-outfit uppercase flex items-center justify-center py-[15px] md:py-[20px] px-auto rounded-[10px] md:rounded-[15px] transition txt-div-22 btn-p btn-glare btn-shine ${className}`;

    if (href) {
        const isInternal = href.startsWith("/") || href.startsWith("#");
        const isSpecialProtocol = /^(mailto:|tel:|https?:\/\/)/i.test(href);
        // Treat anything that isn't an internal path/anchor or an already-prefixed
        // protocol as an external link missing its scheme (e.g. "wa.me/123").
        const resolvedHref = isInternal || isSpecialProtocol ? href : `https://${href}`;

        if (isInternal) {
            return (
                <Link href={resolvedHref} className={`${cls} ${disabled || isLoading ? "opacity-70 pointer-events-none" : ""}`}>
                    {isLoading ? <Loader size="sm" light /> : children}
                </Link>
            );
        }

        return (
            <a
                href={resolvedHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`${cls} ${disabled || isLoading ? "opacity-70 pointer-events-none" : ""}`}
            >
                {isLoading ? <Loader size="sm" light /> : children}
            </a>
        );
    }

    return (
        <button 
            type={type} 
            className={`${cls} ${disabled || isLoading ? "opacity-70 cursor-not-allowed" : ""}`} 
            onClick={onClick} 
            disabled={disabled || isLoading}
        >
            {isLoading ? <Loader size="sm" light /> : children}
        </button>
    );
}

