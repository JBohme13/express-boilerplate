const clientInfoService = {
    getAll(knex) {
        return knex.select('*').from('client_info')
    },

    insertClient(knex, newClient) {
        return knex
            .insert(newClient)
            .into('client_info')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from('client_info')
            .select('*')
            .where('id', id)
            .first()
    },

    deleteClient(knex, id) {
        return knex('client_info')
            .where({ id })
            .delete()
    },

    updateClient(knex, id, newClientFields) {
        return knex('client_info')
            .where({id})
            .update(newClientFields)
    }
}

module.exports = clientInfoService;