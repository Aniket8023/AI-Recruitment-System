package com.airecruitment.exception.custom;

public class AccountNotActiveException extends RuntimeException {

    public AccountNotActiveException(String message) {
        super(message);
    }
}