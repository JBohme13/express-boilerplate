const clientContactService = {
    getAll(knex) {
        return knex.select('*').from('client-contact')
    },

    insertInfo(knex, newClient) {
        return knex
            .insert(newClient)
            .into('client_contact')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from('client_contact')
            .select('*')
            .where('id', id)
            .first()
    },

    deleteClient(knex, id) {
        return knex('client-contact')
            .where({id})
            .delete()
    },

    updateClient(knex, id, newClientFields) {
        return knex('client_contact')
            .where({id})
            .update(newClientFields)
    }
}

module.exports = clientContactService;