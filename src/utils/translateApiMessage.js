const messageMap = {
    "Past dates are not allowed": "Não é permitido selecionar datas passadas.",
    "Venue not found": "Salão não encontrado.",
    "Reservation not found": "Reserva não encontrada.",
    "Payment not found": "Pagamento não encontrado.",
    "Payment not found for this reservation": "Pagamento não encontrado para esta reserva.",
    "Reservation ID not found in session metadata": "ID da reserva não encontrado na sessão de pagamento.",
    "Reservation not found in webhook processing": "Reserva não encontrada no processamento do webhook.",
    "Authenticated user not found": "Usuário autenticado não encontrado.",
    "Token structure is invalid": "Estrutura do token inválida.",
    "Internal server error": "Erro interno do servidor.",
    "Record not found": "Registro não encontrado.",
    "Missing required fields": "Preencha os campos obrigatórios.",
    "Reservation id not returned": "Não foi possível obter o identificador da reserva.",
    "This action is not allowed for a finalized reservation":
        "Esta ação não é permitida para uma reserva finalizada.",
    "Authentication error": "Erro de autenticação.",
    "Resource not found": "Recurso não encontrado.",
    "Database error": "Erro no banco de dados.",
    "Unexpected database error": "Erro inesperado no banco de dados.",
    "Origin not allowed by CORS": "Origem não permitida.",
    "Email and password are required": "E-mail e senha são obrigatórios.",
    "Google access token is required": "O token de acesso do Google é obrigatório.",
    "User not found": "Usuário não encontrado.",
    "Blocked date not found": "Data bloqueada não encontrada.",
    "Kids area price is required": "O valor da área kids é obrigatório.",
    "Pool price is required": "O valor da piscina é obrigatório.",
};

export function translateApiMessage(message) {
    if (!message) return "Ocorreu um erro inesperado.";

    return messageMap[message] || message;
}