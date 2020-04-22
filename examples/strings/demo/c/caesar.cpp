typedef long int i32;

extern "C" {
  void caesarEncrypt(i32 *plaintext, i32 plaintextLength, i32 key) {
    for (int i = 0; i < plaintextLength; i++) {
      plaintext[i] = (plaintext[i] + key) % 26;
    }
  }

  void caesarDecrypt(i32 *ciphertext, i32 ciphertextLength, i32 key) {
    for (int i = 0; i < ciphertextLength; i++) {
      ciphertext[i] = (ciphertext[i] - key) % 26;
    }
  }
}
