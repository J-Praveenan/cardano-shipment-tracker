use cardano/transaction.{Transaction, OutputReference}
use types/shipment_datum.{ShipmentDatum}
use types/shipment_redeemer.{ShipmentRedeemer, Create, Start, Update, Deliver}
use helper/validate_create.{validate_create}
use helper/validate_start.{validate_start}
use helper/validate_update.{validate_update}
use helper/validate_deliver.{validate_deliver}

validator shipmentValidator{
    
    spend(
        datum: Option<ShipmentDatum>,
        redeemer: ShipmentRedeemer,
        _utxo: OutputReference,
        self: Transaction
    ){

        expect Some(d) = datum

        when redeemer is {
            Create -> validate_create(self, d)
            Start -> validate_start(self, d)
            Update(loc, time) -> validate_update(self, d, loc, time)
            Deliver -> validate_deliver(self, d)
        }
    }

    else(_){
        fail
    }
}