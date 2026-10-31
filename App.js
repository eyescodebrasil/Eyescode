import { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';

import { supabase } from './src/lib/supabase';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telaAuth, setTelaAuth] = useState('login');
  
  useEffect(() => {
    let ativo = true;
    
    async function verificarSessao() {
      const inicio = Date.now();
      
      try {
        const { data, error } =
        await supabase.auth.getSession();
        
        if (error) {
          console.error(
            'Erro ao verificar sessão:',
            error
          );
        }
        
        if (ativo) {
          setSession(data?.session || null);
        }
      } catch (error) {
        console.error(
          'Erro ao verificar sessão:',
          error
        );
        
        if (ativo) {
          setSession(null);
        }
      } finally {
        const tempoDecorrido = Date.now() - inicio;
        const tempoRestante = Math.max(
          0,
          2000 - tempoDecorrido
        );
        
        setTimeout(() => {
          if (ativo) {
            setLoading(false);
          }
        }, tempoRestante);
      }
    }
    
    verificarSessao();
    
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(
      (_event, novaSessao) => {
        if (ativo) {
          setSession(novaSessao);
        }
      }
    );
    
    return () => {
      ativo = false;
      authListener.unsubscribe();
    };
    
  }, []);
  
  // TELA DE ABERTURA
  if (loading) {
    return (
      <View style={styles.loading}>
<Image
source={require('./assets/eyescode-splash.png')}
style={styles.splash}
resizeMode="contain"
/>
</View>
    );
  }
  
  // USUÁRIO NÃO LOGADO
  if (!session) {
    if (telaAuth === 'cadastro') {
      return (
        <RegisterScreen
onBack={() => setTelaAuth('login')}
/>
      );
    }
    
    return (
      <LoginScreen
    onRegister={() => setTelaAuth('cadastro')}
  />
    );
    
  }
  
  // USUÁRIO LOGADO
  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#02030a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  splash: {
    width: '100%',
    height: '100%',
  },
});