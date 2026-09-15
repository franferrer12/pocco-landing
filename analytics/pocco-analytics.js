#!/usr/bin/env node

/**
 * POCCO CLUB - Google Analytics Analyzer
 *
 * Script para analizar métricas de Google Analytics automáticamente
 * Genera reportes de:
 * - Eventos de compra de entradas
 * - Engagement (scroll, tiempo)
 * - Redes sociales
 * - Conversiones
 */

const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Configuración
const PROPERTY_ID = '475752389'; // Tu Property ID de GA4: G-REG9BSZ0G1

// Inicializar cliente
let analyticsDataClient;

try {
    // Intenta cargar credenciales desde archivo
    analyticsDataClient = new BetaAnalyticsDataClient({
        keyFilename: __dirname + '/credentials.json'
    });
    console.log('✅ Credenciales cargadas desde credentials.json');
} catch (error) {
    console.log('⚠️  Credenciales no encontradas. Usando variables de entorno.');
    // Fallback a variables de entorno
    analyticsDataClient = new BetaAnalyticsDataClient();
}

// Función para obtener métricas de los últimos 7 días
async function getTicketPurchaseEvents() {
    console.log('\n📊 ANÁLISIS DE COMPRA DE ENTRADAS\n');
    console.log('═'.repeat(60));

    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                {
                    name: 'eventName',
                },
                {
                    name: 'customEvent:event_label', // Nombre del evento
                },
            ],
            metrics: [
                {
                    name: 'eventCount',
                },
            ],
            dimensionFilter: {
                filter: {
                    fieldName: 'eventName',
                    stringFilter: {
                        value: 'view_ticket_modal',
                    },
                },
            },
            orderBys: [
                {
                    metric: {
                        metricName: 'eventCount',
                    },
                    desc: true,
                },
            ],
        });

        console.log('\n🎫 Eventos con más clics en "Comprar entradas":\n');

        if (response.rows && response.rows.length > 0) {
            response.rows.forEach((row, index) => {
                const eventLabel = row.dimensionValues[1]?.value || 'Sin nombre';
                const eventCount = row.metricValues[0]?.value || '0';

                console.log(`${index + 1}. ${eventLabel}`);
                console.log(`   └─ ${eventCount} clics\n`);
            });
        } else {
            console.log('   No hay datos todavía. Los eventos empezarán a aparecer\n   en las próximas 24-48 horas.\n');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Función para obtener engagement (scroll y tiempo)
async function getEngagementMetrics() {
    console.log('\n📈 MÉTRICAS DE ENGAGEMENT\n');
    console.log('═'.repeat(60));

    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                {
                    name: 'eventName',
                },
                {
                    name: 'customEvent:event_label',
                },
            ],
            metrics: [
                {
                    name: 'eventCount',
                },
            ],
            dimensionFilter: {
                orGroup: {
                    expressions: [
                        {
                            filter: {
                                fieldName: 'eventName',
                                stringFilter: {
                                    value: 'scroll_depth',
                                },
                            },
                        },
                        {
                            filter: {
                                fieldName: 'eventName',
                                stringFilter: {
                                    value: 'time_on_page',
                                },
                            },
                        },
                    ],
                },
            },
        });

        console.log('\n🔄 Scroll profundo:\n');
        const scrollEvents = response.rows?.filter(row =>
            row.dimensionValues[0]?.value === 'scroll_depth'
        ) || [];

        if (scrollEvents.length > 0) {
            scrollEvents.forEach(row => {
                const depth = row.dimensionValues[1]?.value;
                const count = row.metricValues[0]?.value;
                console.log(`   • ${depth} scroll: ${count} usuarios`);
            });
        } else {
            console.log('   Sin datos aún');
        }

        console.log('\n⏱️  Tiempo en página:\n');
        const timeEvents = response.rows?.filter(row =>
            row.dimensionValues[0]?.value === 'time_on_page'
        ) || [];

        if (timeEvents.length > 0) {
            timeEvents.forEach(row => {
                const time = row.dimensionValues[1]?.value;
                const count = row.metricValues[0]?.value;
                console.log(`   • ${time}: ${count} usuarios`);
            });
        } else {
            console.log('   Sin datos aún');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Función para obtener clics en redes sociales
async function getSocialMediaClicks() {
    console.log('\n📱 REDES SOCIALES\n');
    console.log('═'.repeat(60));

    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                {
                    name: 'customEvent:event_label',
                },
            ],
            metrics: [
                {
                    name: 'eventCount',
                },
            ],
            dimensionFilter: {
                filter: {
                    fieldName: 'eventName',
                    stringFilter: {
                        value: 'social_click',
                    },
                },
            },
            orderBys: [
                {
                    metric: {
                        metricName: 'eventCount',
                    },
                    desc: true,
                },
            ],
        });

        console.log('\n🔗 Clics en redes sociales:\n');

        if (response.rows && response.rows.length > 0) {
            response.rows.forEach(row => {
                const platform = row.dimensionValues[0]?.value;
                const count = row.metricValues[0]?.value;
                console.log(`   • ${platform}: ${count} clics`);
            });
        } else {
            console.log('   Sin datos aún');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Función para obtener resumen general
async function getOverviewMetrics() {
    console.log('\n📊 RESUMEN GENERAL\n');
    console.log('═'.repeat(60));

    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                {
                    name: 'activeUsers',
                },
                {
                    name: 'sessions',
                },
                {
                    name: 'screenPageViews',
                },
                {
                    name: 'averageSessionDuration',
                },
            ],
        });

        if (response.rows && response.rows.length > 0) {
            const row = response.rows[0];
            const users = row.metricValues[0]?.value || '0';
            const sessions = row.metricValues[1]?.value || '0';
            const pageViews = row.metricValues[2]?.value || '0';
            const avgDuration = parseInt(row.metricValues[3]?.value || '0');

            console.log(`\n👥 Usuarios activos: ${users}`);
            console.log(`📊 Sesiones: ${sessions}`);
            console.log(`📄 Páginas vistas: ${pageViews}`);
            console.log(`⏱️  Duración promedio: ${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s\n`);
        } else {
            console.log('\n   Sin datos todavía\n');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Función principal
async function main() {
    console.clear();
    console.log('\n🎯 POCCO CLUB - ANALYTICS DASHBOARD\n');
    console.log('Período: Últimos 7 días');
    console.log('Property: G-REG9BSZ0G1');
    console.log('\n');

    await getOverviewMetrics();
    await getTicketPurchaseEvents();
    await getEngagementMetrics();
    await getSocialMediaClicks();

    console.log('\n═'.repeat(60));
    console.log('\n💡 Para optimizar conversiones:');
    console.log('   1. Identifica qué eventos tienen más clics en "Comprar"');
    console.log('   2. Replica el formato de esos eventos');
    console.log('   3. Mejora las imágenes y descripciones');
    console.log('   4. Promociona más en redes sociales\n');
}

// Ejecutar
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    getTicketPurchaseEvents,
    getEngagementMetrics,
    getSocialMediaClicks,
    getOverviewMetrics
};
