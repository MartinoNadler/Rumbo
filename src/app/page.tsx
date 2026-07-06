import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4 text-center">
      <h1 className="text-3xl font-semibold text-gray-900">
        Seguimiento
      </h1>
      <p className="max-w-md text-gray-600">
        Centralizá el entrenamiento de tus alumnos en un solo lugar.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
