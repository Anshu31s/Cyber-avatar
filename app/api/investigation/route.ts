import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { type, query } = await request.json();

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock Data based on type
        let result = {};

        switch (type) {
            case "Vehicle Search":
                result = {
                    vehicle_number: query,
                    owner: "John Doe",
                    model: "Toyota Fortuner",
                    registration_date: "2020-05-15",
                    status: "Active",
                    insurance_expiry: "2025-05-14"
                };
                break;
            case "Mobile Lookup":
                result = {
                    mobile: query,
                    operator: "Jio",
                    circle: "Delhi NCR",
                    subscriber_name: "Jane Smith",
                    activation_date: "2018-09-10",
                    status: "Active"
                };
                break;
            case "Phone to UPI ID":
                result = {
                    upi_id: `${query}@okhdfcbank`,
                    name: "Jane Smith",
                    bank: "HDFC Bank"
                };
                break;
            case "IP Geolocation":
                result = {
                    ip: query,
                    city: "Mountain View",
                    region: "California",
                    country: "US",
                    loc: "37.3860,-122.0838",
                    org: "AS15169 Google LLC",
                    postal: "94035",
                    timezone: "America/Los_Angeles"
                };
                break;
            case "Domain WHOIS":
                result = {
                    domain: query,
                    registrar: "GoDaddy.com, LLC",
                    creation_date: "1997-09-15T04:00:00Z",
                    expiration_date: "2028-09-14T04:00:00Z",
                    name_servers: ["NS1.GOOGLE.COM", "NS2.GOOGLE.COM"]
                }
                break;
            default:
                result = {
                    message: "Data found",
                    query: query,
                    type: type,
                    details: "Mock data for demonstration purposes."
                };
        }

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
