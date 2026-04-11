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

export const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    padding: 0 14px;
    border-radius: 14px;
    border: 1px solid ${({ $error }) => ($error ? "#ef4444" : "#d1d5db")};
    gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus-within {
        border-color: ${({ $error }) => ($error ? "#ef4444" : "#1f4f41")};
        box-shadow: 0 0 0 4px rgba(31, 79, 65, 0.12);
    }
`;

export const Prefix = styled.span`
    font-size: 20px;
    line-height: 1;
    flex-shrink: 0;
    user-select: none;
`;

export const Divider = styled.span`
    width: 1px;
    height: 20px;
    background-color: #d1d5db;
    flex-shrink: 0;
`;

export const InnerInput = styled.input`
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    font-size: 14px;
    background: transparent;
    padding: 0;
    min-width: 0;
`;

export const ToggleButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #9ca3af;
    flex-shrink: 0;
    transition: color 0.2s;

    &:hover {
        color: #374151;
    }
`;

export const Error = styled.span`
    font-size: 12px;
    color: #ef4444;
`;
