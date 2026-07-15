import { Button, Typography } from '@mui/joy';
import { useCallback, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../store/store';
import { useState } from 'react';
import ImageCarousel from './ImageCarousel';
import { useNavigate } from 'react-router-dom';
import PromotionsCarousel from './PromotionCarousel/PromotionCarousel';
import ProductSection from "./ProductSection.tsx";
import { Cog, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';
import CategoriesSection from "../CategoriesSection.tsx";
import PaymentMethodsSection from "./PaymentMethods.tsx";
const apiUrl = import.meta.env.VITE_API_URL;

const LandingPage = () => {

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<string[]>([])

    const navigate = useNavigate()

    const loadCategories = useCallback(async () => {
        try {
            const response = await axios.get<string[]>(
                `${apiUrl}/rest/api/1/producto/categorias`,
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.log("Error fetching categories", error);
        }
    }, []);

    const loadProducts = useCallback(async () => {


        //console.log(`Bearer ${getAccessToken()}`)

        try {
            // console.log({
            //     "Content-Type": "application/json",
            //     "Accept": "application/json",
            //
            // })
            const productRequest = await axios.get<Product[]>(`${apiUrl}/rest/api/1/producto/top`, {
                withCredentials: true
            })

            //console.log(productRequest.status)
            if (productRequest.status !== 200) {
                console.log("Error fetching products")
                return
            }

            //console.log(productRequest.data)
            setProducts(productRequest.data)
            //console.log("Products loaded")
        } catch (error) {
            //console.log("Error fetching products")
            console.log(error)
            return
        }
        // Fetch products from API


    }, []);

    useEffect(() => {
        void Promise.all([loadProducts(), loadCategories()])
    }, [loadProducts, loadCategories])

    return (
        <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(248,250,252,1)_40%,rgba(226,232,240,1)_100%)] text-slate-900">
            {/* Header */}
            <header className="relative overflow-hidden border-b border-red-900/30 bg-linear-to-br from-red-950 via-red-900 to-red-800 text-white">
                <div className="absolute inset-0 opacity-[0.16] [bg-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [bg-size:48px_48px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
                <div className="relative mx-auto grid max-w-screen-2xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
                    <div className="flex flex-col justify-center text-left">
                        <div className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                            SISCAD Industrial
                        </div>
                        <Typography level="h1" sx={{ color: 'white' }} className="animate-fade-up mt-6 max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: '80ms' }}>
                            Encuentra miles de productos industriales al mejor precio.
                        </Typography>
                        <Typography level="body-lg" sx={{ color: 'white' }} className="animate-fade-up mt-5 max-w-2xl text-base leading-8 sm:text-lg" style={{ animationDelay: '140ms' }}>
                            Herramientas, automatización, equipo industrial y suministros especializados para empresas.
                        </Typography>
                        <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '220ms' }}>
                            <Button
                                variant="solid"
                                color="primary"
                                className="rounded-full! px-6! py-3! font-semibold! shadow-lg! shadow-primary/20!"
                                onClick={() => {
                                    navigate("/tienda")
                                }}
                            >
                                Explorar catálogo
                            </Button>
                            <Button
                                variant="outlined"
                                color="neutral"
                                className="rounded-full! border-white/30! px-6! py-3! font-semibold! text-white! hover:bg-white/10!"
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    color: 'white',
                                    '&:hover': {
                                        borderColor: 'rgba(255,255,255,0.35)',
                                    },
                                }}
                                onClick={() => {
                                    navigate("/contact")
                                }}
                            >
                                Solicitar cotización
                            </Button>
                        </div>
                        <div className="animate-fade-up mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '300ms' }}>
                            {[
                                ["+10k", "productos"],
                                ["B2B / B2C", "atención"],
                                ["Entrega", "rápida"],
                            ].map(([value, label]) => (
                                <div key={value} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                    <div className="text-2xl font-black text-white">{value}</div>
                                    <div className="mt-1 text-sm text-slate-300">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 rounded-4xl border border-white/10 bg-white/3" />

                        <div className="relative grid gap-4 sm:grid-cols-2">
                            <div
                                className="animate-fade-up sm:col-span-2 rounded-[1.75rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/20 backdrop-blur-md"
                                style={{ animationDelay: '120ms' }}
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-white">
                                            Catálogo industrial
                                        </p>

                                        <h3 className="mt-3 max-w-xl text-2xl font-black leading-tight text-white">
                                            Soluciones industriales para operación continua.
                                        </h3>

                                        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                                            Herramientas, seguridad, maquinaria y refacciones para empresas que
                                            necesitan mantener su producción activa.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        aria-label="Explorar catálogo industrial"
                                        className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:border-primary/50 hover:bg-primary"
                                    >
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>

                                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {[
                                        { label: 'Herramientas', desc: 'Manuales y eléctricas', Icon: Wrench },
                                        { label: 'Seguridad', desc: 'EPP y protección', Icon: ShieldCheck },
                                        { label: 'Maquinaria', desc: 'Equipos y refacciones', Icon: Cog },
                                    ].map(({ label, desc, Icon }) => (
                                        <div
                                            key={label}
                                            className="group rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-slate-900/70"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition group-hover:scale-105">
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-bold text-white">{label}</p>
                                                    <p className="mt-0.5 text-xs text-slate-300">{desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {[
                                {
                                    eyebrow: 'Seguridad',
                                    title: 'Protección industrial confiable',
                                    desc: 'EPP y productos pensados para entornos exigentes.',
                                    Icon: ShieldCheck,
                                    variant: 'light',
                                },
                                {
                                    eyebrow: 'Maquinaria',
                                    title: 'Stock para productividad',
                                    desc: 'Equipos y refacciones con enfoque B2B.',
                                    Icon: Cog,
                                    variant: 'light',
                                },
                            ].map(({ eyebrow, title, desc, Icon, variant }, index) => (
                                <div
                                    key={title}
                                    className="animate-fade-up rounded-[1.75rem] border border-white/10 bg-white p-5 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:shadow-black/30"
                                    style={{ animationDelay: `${180 + index * 60}ms` }}
                                >
                                    <div
                                        className={
                                            variant === 'dark'
                                                ? 'flex h-40 flex-col justify-between rounded-[1.15rem] bg-slate-950 p-4 text-white'
                                                : 'flex h-40 flex-col justify-between rounded-[1.15rem] bg-linear-to-br from-white to-red-50 p-4'
                                        }
                                    >
                                        <div
                                            className={
                                                variant === 'dark'
                                                    ? 'flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-slate-300'
                                                    : 'flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-slate-500'
                                            }
                                        >
                                            <span>{eyebrow}</span>
                                            <Icon
                                                className={
                                                    variant === 'dark'
                                                        ? 'h-5 w-5'
                                                        : 'h-5 w-5 text-primary'
                                                }
                                            />
                                        </div>

                                        <div>
                                            <p
                                                className={
                                                    variant === 'dark'
                                                        ? 'text-lg font-black text-white'
                                                        : 'text-lg font-black text-slate-900'
                                                }
                                            >
                                                {title}
                                            </p>
                                            <p
                                                className={
                                                    variant === 'dark'
                                                        ? 'mt-1 text-sm leading-6 text-slate-300'
                                                        : 'mt-1 text-sm leading-6 text-slate-600'
                                                }
                                            >
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>
            <br />
            <div>
                <PromotionsCarousel />
            </div>
            <br />
            <div className='bg-white shadow-lg flex flex-col py-10 px-4'>
                <ProductSection productData={products} title={"Nuestros productos"} />
            </div>
            <div className='flex flex-col my-10 gap-10 bg-white h-auto py-10'>
                <section>
                    <ImageCarousel />
                </section>
            </div>

            <div className="">
                <PaymentMethodsSection />
            </div>

            <div className="bg-white py-10">
                <CategoriesSection title={"Explora Nuestras Categorías"} categories={categories} />
            </div>



            {/* Footer */}

        </div>
    );
};

export default LandingPage;
