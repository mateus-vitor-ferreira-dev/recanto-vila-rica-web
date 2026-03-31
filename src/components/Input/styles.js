import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
`;

export const Label = styled.label`
    font-size: 13px;
    font-weight: 600;
    color: #374151;
`;

export const Input = styled.input`
    width: 100%;
    height: 48px;
    padding: 0 14px;
    border-radius: 14px;
    border: 1px solid ${({ $error }) => ($error ? "#ef4444" : "#d1d5db")};
    font-size: 14px;
    outline: none;
    transition: 0.2s;

    &:focus {
        border-color: ${({ $error }) => ($error ? "#ef4444" : "#1f4f41")};
        box-shadow: 0 0 0 4px rgba(31, 79, 65, 0.12);
    }
`;

export const Error = styled.span`
    font-size: 12px;
    color: #ef4444;
`;