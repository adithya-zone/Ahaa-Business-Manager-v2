// ==========================================
// Ahaa Business Manager ERP v2
// API Service
// ==========================================

class ApiService {

    // ==========================================
    // GET
    // ==========================================

    static async get(url) {

        const response = await fetch(url, {

            method: "GET",

            credentials: "include"

        });

        return await response.json();

    }

    // ==========================================
    // POST
    // ==========================================

    static async post(url, data) {

        const response = await fetch(url, {

            method: "POST",

            credentials: "include",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        return await response.json();

    }

    // ==========================================
    // PUT
    // ==========================================

    static async put(url, data) {

        const response = await fetch(url, {

            method: "PUT",

            credentials: "include",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        return await response.json();

    }

    // ==========================================
    // DELETE
    // ==========================================

    static async delete(url) {

        const response = await fetch(url, {

            method: "DELETE",

            credentials: "include"

        });

        return await response.json();

    }

}

// Make available globally
window.ApiService = ApiService;