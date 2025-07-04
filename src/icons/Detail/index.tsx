"use client";

import React from "react";

export interface IconProps {
    width?: string;
    height?: string;
}

const Detail: React.FC<IconProps> = ({ width = "14", height = "18" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none">
            <path d="M0.5 0.5V7.16667H7.16667V0.5H0.5ZM5.5 5.5H2.16667V2.16667H5.5V5.5ZM0.5 8.83333V15.5H7.16667V8.83333H0.5ZM5.5 13.8333H2.16667V10.5H5.5V13.8333ZM8.83333 0.5V7.16667H15.5V0.5H8.83333ZM13.8333 5.5H10.5V2.16667H13.8333V5.5ZM8.83333 8.83333V15.5H15.5V8.83333H8.83333ZM13.8333 13.8333H10.5V10.5H13.8333V13.8333Z" fill="currentColor" />
        </svg>
    );
};

export default Detail;