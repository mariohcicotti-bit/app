-- ================================================
-- SVRN TAX SIMULATOR - SUPABASE DATABASE SETUP
-- ================================================
-- Execute este SQL no Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- ================================================

-- 1. Criar tabela de profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_pro_member BOOLEAN DEFAULT FALSE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS - Usuários podem ver e editar apenas seu próprio profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Função para criar profile automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, is_pro_member)
  VALUES (NEW.id, NEW.email, NOW(), FALSE);
  RETURN NEW;
END;
$$;

-- 5. Trigger que executa a função após criação de novo usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 6. (Opcional) Adicionar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro_member ON public.profiles(is_pro_member);

-- ================================================
-- FIM DO SCRIPT
-- ================================================
-- Após executar, teste criando um novo usuário no app
-- O profile deve ser criado automaticamente
-- ================================================
