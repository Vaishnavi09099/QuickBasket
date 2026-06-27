declare module "next-auth" {
    interface User {
        id: string;
        name: string;
        email: string;
        role: "user" | "admin" | "deliveryBoy";
    }

}

export { }
            
