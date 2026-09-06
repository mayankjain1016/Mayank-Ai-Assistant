class AuthRepository {
  /**
   * Extension point for future Redis session management
   * Services will call this layer for stateful auth requirements.
   */
}

export const authRepository = new AuthRepository();
