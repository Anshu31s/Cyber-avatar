import { NextResponse } from 'next/server';
import si from 'systeminformation';

export async function GET() {
    try {
        const [cpu, mem, disk, network, cpuInfo] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.cpu(),
        ]);

        // Format data for frontend
        const stats = {
            cpu: {
                usage: cpu.currentLoad.toFixed(1),
                temp: cpu.avgLoad,
                cores: cpuInfo.physicalCores, // Use physical cores
            },
            memory: {
                total: mem.total,
                used: mem.active, // 'active' is more accurate for "used" than 'used' which includes buffers/cache in some OS
                free: mem.available,
            },
            disk: {
                // usually we care about the main drive (C:)
                total: disk[0]?.size || 0,
                used: disk[0]?.used || 0,
                usePercent: disk[0]?.use || 0,
            },
            network: {
                // aggregate all interfaces or main one
                rx_sec: network[0]?.rx_sec || 0,
                tx_sec: network[0]?.tx_sec || 0,
            },
            uptime: si.time().uptime,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
