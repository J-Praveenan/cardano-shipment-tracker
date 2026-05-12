use aiken/collection/list
use cardano/address.{Credential, Script, VerificationKey}
use cardano/transaction.{Transaction}

pub fn is_signed_by(self: Transaction, cred: Credential) -> Bool {
  when cred is {
    VerificationKey(vkh) -> list.any(self.extra_signatories, fn(s) { s == vkh })
    Script(_) -> False
  }
}
