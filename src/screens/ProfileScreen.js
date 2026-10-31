import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Pressable,
  Linking,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker
  from "expo-image-picker";

import EditProfileModal
  from "../components/profile/EditProfileModal";

import {
  useEffect,
  useState,
} from "react";

import {
  Ionicons
} from "@expo/vector-icons";

import Header
  from "../components/Header";

import {
  supabase
} from "../lib/supabase";

import {
  colors
} from "../theme/colors";


export default function ProfileScreen({
  onNavigate
}) {

  const [perfil, setPerfil] =
    useState(null);

const [livesPerfil, setLivesPerfil] =
  useState([]);

  const [loading, setLoading] =
    useState(true);

  const [erro, setErro] =
    useState(null);

  const [abaAtiva, setAbaAtiva] =
    useState("posts");

  const [seguidores, setSeguidores] =
    useState(0);

  const [seguindo, setSeguindo] =
    useState(0);

const [
  editarPerfilAberto,
  setEditarPerfilAberto
] = useState(false);

  useEffect(() => {

    carregarPerfil();

  }, []);


  async function carregarPerfil() {

    try {

      setLoading(true);
      setErro(null);


      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();


      if (authError || !user) {

        setErro(
          "Não foi possível identificar o usuário."
        );

        return;

      }


      const {
        data,
        error,
      } =
        await supabase
          .from("users")
          .select(`
            id,
            gamertag,
            nome,
            avatar,
            banner,
            bio,
            xp,
            nivel,
            redes
          `)
          .eq("id", user.id)
          .single();


      if (error) {

        setErro(error.message);

        return;

      }


      setPerfil(data);

const {
  data: livesSalvas,
  error: erroLives,
} =
  await supabase
    .from("lives")
    .select(`
      id,
      streamer_id,
      titulo,
      descricao,
      jogo,
      categoria,
      plataforma,
      url,
      thumbnail,
      espectadores,
      pico_espectadores,
      curtidas,
      ao_vivo,
      criada_em,
      encerrada_em,
      salvar_perfil
    `)
    .eq(
      "streamer_id",
      user.id
    )
    .eq(
      "salvar_perfil",
      true
    )
    .order(
      "criada_em",
      {
        ascending: false
      }
    );


if (erroLives) {

  console.error(
    "Erro ao carregar lives do perfil:",
    erroLives
  );

}
else {

  setLivesPerfil(
    livesSalvas || []
  );

}

const {
  count: totalSeguidores,
  error: erroSeguidores,
} =
  await supabase
    .from("user_connections")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("alvo_id", user.id)
    .eq("tipo", "seguir")
    .eq("status", "aceito");


if (erroSeguidores) {

  console.error(
    "Erro ao contar seguidores:",
    erroSeguidores
  );

}
else {

  setSeguidores(
    totalSeguidores || 0
  );

}


const {
  count: totalSeguindo,
  error: erroSeguindo,
} =
  await supabase
    .from("user_connections")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("usuario_id", user.id)
    .eq("tipo", "seguir")
    .eq("status", "aceito");


if (erroSeguindo) {

  console.error(
    "Erro ao contar seguindo:",
    erroSeguindo
  );

}
else {

  setSeguindo(
    totalSeguindo || 0
  );

}

    }

    catch (error) {

      console.error(
        "Erro ao carregar perfil:",
        error
      );

      setErro(
        "Erro inesperado ao carregar perfil."
      );

    }

    finally {

      setLoading(false);

    }

  }

async function alterarAvatar() {

  try {

    const permissao =
      await ImagePicker
        .requestMediaLibraryPermissionsAsync();


    if (!permissao.granted) {

      alert(
        "Precisamos de acesso às fotos para alterar o avatar."
      );

      return;

    }


    const resultado =
      await ImagePicker
        .launchImageLibraryAsync({

          mediaTypes: ["images"],

          allowsEditing: true,

          aspect: [1, 1],

          quality: 0.8,

        });


    if (resultado.canceled) {
      return;
    }


    const imagem =
      resultado.assets[0];


    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();


    if (authError || !user) {

      alert(
        "Não foi possível identificar sua conta."
      );

      return;

    }


    // =====================================
    // TRANSFORMAR IMAGEM EM ARRAYBUFFER
    // =====================================

    const response =
      await fetch(
        imagem.uri
      );

    const arrayBuffer =
      await response.arrayBuffer();


    // =====================================
    // EXTENSÃO / TIPO
    // =====================================

    const extensao =
      imagem.fileName
        ?.split(".")
        .pop()
        ?.toLowerCase()
      || "jpg";


    const contentType =
      imagem.mimeType
      || `image/${extensao}`;


    // =====================================
    // CAMINHO DO ARQUIVO
    // =====================================

    const caminho =
      `${user.id}/avatar-${Date.now()}.${extensao}`;


    // =====================================
    // UPLOAD
    // =====================================

    const {
      error: uploadError
    } =
      await supabase.storage
        .from("avatars")
        .upload(
          caminho,
          arrayBuffer,
          {
            contentType,
            upsert: true,
          }
        );


    if (uploadError) {

      console.error(
        "Erro no upload do avatar:",
        uploadError
      );

      alert(
        uploadError.message
      );

      return;

    }


    // =====================================
    // PEGAR URL PÚBLICA
    // =====================================

    const {
      data: publicData
    } =
      supabase.storage
        .from("avatars")
        .getPublicUrl(
          caminho
        );


    const avatarUrl =
      publicData.publicUrl;


    // =====================================
    // ATUALIZAR USERS
    // =====================================

    const {
      data: perfilAtualizado,
      error: updateError,
    } =
      await supabase
        .from("users")
        .update({
          avatar: avatarUrl
        })
        .eq(
          "id",
          user.id
        )
        .select(`
          id,
          gamertag,
          nome,
          avatar,
          banner,
          bio,
          xp,
          redes,
          nivel
        `)
        .single();


    if (updateError) {

      console.error(
        "Erro ao atualizar avatar:",
        updateError
      );

      alert(
        updateError.message
      );

      return;

    }


    // =====================================
    // ATUALIZAR TELA
    // =====================================

    setPerfil(
      perfilAtualizado
    );


  }

  catch (error) {

    console.error(
      "Erro ao alterar avatar:",
      error
    );

    alert(
      "Não foi possível alterar o avatar."
    );

  }

}

async function alterarBanner() {

  try {

    const permissao =
      await ImagePicker
        .requestMediaLibraryPermissionsAsync();


    if (!permissao.granted) {

      alert(
        "Precisamos de acesso às fotos para alterar o banner."
      );

      return;

    }


    const resultado =
      await ImagePicker
        .launchImageLibraryAsync({

          mediaTypes: ["images"],

          allowsEditing: true,

          aspect: [16, 9],

          quality: 0.85,

        });


    if (resultado.canceled) {
      return;
    }


    const imagem =
      resultado.assets[0];


    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();


    if (authError || !user) {

      alert(
        "Não foi possível identificar sua conta."
      );

      return;

    }


    // =====================================
    // IMAGEM LOCAL → ARRAYBUFFER
    // =====================================

    const response =
      await fetch(
        imagem.uri
      );

    const arrayBuffer =
      await response.arrayBuffer();


    // =====================================
    // EXTENSÃO / TIPO
    // =====================================

    const extensao =
      imagem.fileName
        ?.split(".")
        .pop()
        ?.toLowerCase()
      || "jpg";


    const contentType =
      imagem.mimeType
      || `image/${extensao}`;


    // =====================================
    // CAMINHO DO BANNER
    // =====================================

    const caminho =
      `${user.id}/banner-${Date.now()}.${extensao}`;


    // =====================================
    // UPLOAD
    // =====================================

    const {
      error: uploadError
    } =
      await supabase.storage
        .from("banners")
        .upload(
          caminho,
          arrayBuffer,
          {
            contentType,
            upsert: true,
          }
        );


    if (uploadError) {

      console.error(
        "Erro no upload do banner:",
        uploadError
      );

      alert(
        uploadError.message
      );

      return;

    }


    // =====================================
    // URL PÚBLICA
    // =====================================

    const {
      data: publicData
    } =
      supabase.storage
        .from("banners")
        .getPublicUrl(
          caminho
        );


    const bannerUrl =
      publicData.publicUrl;


    // =====================================
    // ATUALIZAR USUÁRIO
    // =====================================

    const {
      data: perfilAtualizado,
      error: updateError,
    } =
      await supabase
        .from("users")
        .update({
          banner: bannerUrl
        })
        .eq(
          "id",
          user.id
        )
        .select(`
          id,
          gamertag,
          nome,
          avatar,
          redes,
          banner,
          bio,
          xp,
          nivel
        `)
        .single();


    if (updateError) {

      console.error(
        "Erro ao atualizar banner:",
        updateError
      );

      alert(
        updateError.message
      );

      return;

    }


    // =====================================
    // ATUALIZAR TELA
    // =====================================

    setPerfil(
      perfilAtualizado
    );


  }

  catch (error) {

    console.error(
      "Erro ao alterar banner:",
      error
    );

    alert(
      "Não foi possível alterar o banner."
    );

  }

}

async function abrirRede(
  tipo,
  valor
) {

  if (!valor) {
    return;
  }


  let url =
    valor.trim();


  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {

    try {
      await Linking.openURL(url);
    }
    catch (error) {
      console.error(
        "Erro ao abrir link:",
        error
      );
    }

    return;

  }


  const usuario =
    url.replace(/^@/, "");


  switch (tipo) {

    case "instagram":

      url =
        `https://instagram.com/${usuario}`;

      break;


    case "twitch":

      url =
        usuario.includes("twitch.tv/")
          ? `https://${usuario}`
          : `https://twitch.tv/${usuario}`;

      break;


    case "github":

      url =
        usuario.includes("github.com/")
          ? `https://${usuario}`
          : `https://github.com/${usuario}`;

      break;


    case "x":

      url =
        `https://x.com/${usuario}`;

      break;


    case "discord":

      // Se for um link, ele já teria sido
      // tratado acima.
      // Se for só username, não há URL
      // pública confiável para abrir.
      return;


    default:
      return;

  }


  try {

    await Linking.openURL(url);

  }
  catch ( error) {

    console.error(
      "Erro ao abrir rede:",
      error
    );

  }

}

  if (loading) {

    return (

      <View style={styles.container}>

        <Header
          onNavigate={onNavigate}
        />

        <View style={styles.center}>

          <ActivityIndicator
            size="large"
            color="#38bdf8"
          />

        </View>

      </View>

    );

  }


  if (erro || !perfil) {

    return (

      <View style={styles.container}>

        <Header
          onNavigate={onNavigate}
        />

        <View style={styles.center}>

          <Ionicons
            name="alert-circle-outline"
            size={42}
            color="#ef4444"
          />

          <Text style={styles.errorText}>
            {erro || "Perfil não encontrado."}
          </Text>

        </View>

      </View>

    );

  }


  const nomeExibicao =
    perfil.gamertag ||
    perfil.nome ||
    "Jogador";


  return (

    <View style={styles.container}>

      <Header
        onNavigate={onNavigate}
      />


      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ================================= */}
        {/* BANNER */}
        {/* ================================= */}

        <View style={styles.profileHero}>

          {perfil.banner ? (

            <ImageBackground
              source={{
                uri: perfil.banner
              }}
              style={styles.banner}
              imageStyle={styles.bannerImage}
            >

              <View
                style={styles.bannerOverlay}
              />

            </ImageBackground>

          ) : (

            <View
              style={[
                styles.banner,
                styles.bannerFallback,
              ]}
            >

              <Ionicons
                name="game-controller-outline"
                size={52}
                color="#1e3a5f"
              />

            </View>

          )}


  <Pressable
  style={styles.changeBannerButton}
  onPress={alterarBanner}
>

            <Ionicons
              name="camera"
              size={17}
              color="#ffffff"
            />

            <Text
              style={styles.changeBannerText}
            >
              Alterar banner
            </Text>

          </Pressable>


          {/* AVATAR */}

       <Pressable
  style={styles.avatarWrapper}
  onPress={alterarAvatar}
>

  {perfil.avatar ? (

    <Image
      source={{
        uri: perfil.avatar
      }}
      style={styles.avatar}
    />

  ) : (

    <View
      style={[
        styles.avatar,
        styles.avatarFallback,
      ]}
    >

      <Ionicons
        name="person"
        size={46}
        color="#64748b"
      />

    </View>

  )}


  <View style={styles.avatarEditButton}>

    <Ionicons
      name="camera"
      size={17}
      color="#ffffff"
    />

  </View>

</Pressable>

        </View>


        {/* ================================= */}
        {/* IDENTIDADE */}
        {/* ================================= */}

        <View style={styles.identity}>

          <Text style={styles.gamertag}>
            {nomeExibicao}
          </Text>


          {perfil.nome &&
          perfil.nome !== perfil.gamertag ? (

            <Text style={styles.realName}>
              {perfil.nome}
            </Text>

          ) : null}


          <View style={styles.badgesRow}>

            <View style={styles.levelBadge}>

              <Ionicons
                name="star"
                size={15}
                color="#ffffff"
              />

              <Text style={styles.levelText}>
                Nível {perfil.nivel || 1}
              </Text>

            </View>


            <View style={styles.rankBadge}>

              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color="#38bdf8"
              />

              <Text style={styles.rankText}>
                Jogador
              </Text>

            </View>

          </View>

        </View>


        {/* ================================= */}
        {/* BIO */}
        {/* ================================= */}

        <View style={styles.bioArea}>

          <Text style={styles.bio}>

            {
              perfil.bio ||
              "Este usuario ainda não adicionou uma bio."
            }

          </Text>

        </View>


        {/* ================================= */}
        {/* AÇÕES */}
        {/* ================================= */}

        <View style={styles.actionsRow}>

     <Pressable
  style={styles.primaryButton}
  onPress={() =>
    setEditarPerfilAberto(true)
  }
>

            <Ionicons
              name="create-outline"
              size={19}
              color="#ffffff"
            />

            <Text style={styles.primaryButtonText}>
              Editar perfil
            </Text>

          </Pressable>


          <Pressable
            style={styles.secondaryButton}
          >

            <Ionicons
              name="cube-outline"
              size={19}
              color="#ffffff"
            />

            <Text style={styles.secondaryButtonText}>
              Inventário
            </Text>

          </Pressable>

        </View>


        {/* ================================= */}
        {/* ESTATÍSTICAS */}
        {/* ================================= */}

        <View style={styles.statsCard}>

          <View style={styles.statItem}>

            <Text style={styles.statValue}>
              {perfil.xp || 0}
            </Text>

            <Text style={styles.statLabel}>
              XP
            </Text>

          </View>


          <View style={styles.statDivider} />


      <View style={styles.statItem}>

  <Text style={styles.statValue}>
    {seguidores}
  </Text>

  <Text style={styles.statLabel}>
    Seguidores
  </Text>

</View>


<View style={styles.statDivider} />


<View style={styles.statItem}>

  <Text style={styles.statValue}>
    {seguindo}
  </Text>

  <Text style={styles.statLabel}>
    Seguindo
  </Text>

</View>


          <View style={styles.statDivider} />


          <View style={styles.statItem}>

            <Text style={styles.statValue}>
              0
            </Text>

            <Text style={styles.statLabel}>
              Conquistas
            </Text>

          </View>

        </View>

{/* ================================= */}
{/* LIVES */}
{/* ================================= */}

<View style={styles.section}>

  <View style={styles.sectionHeader}>

    <View style={styles.sectionTitleRow}>

      <Ionicons
        name="radio-outline"
        size={22}
        color="#38bdf8"
      />

      <Text style={styles.sectionTitle}>
        Lives
      </Text>

    </View>


    <Pressable>

      <Text style={styles.sectionLink}>
        Ver tudo
      </Text>

    </Pressable>

  </View>


  {livesPerfil.length > 0 ? (

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={
        styles.savedLivesCarousel
      }
    >

      {livesPerfil.map((live) => (

        <LiveProfileCard
          key={live.id}
          live={live}
        />

      ))}

    </ScrollView>

  ) : (

    <View style={styles.emptySmall}>

      <View style={styles.emptyIcon}>

        <Ionicons
          name="videocam-outline"
          size={25}
          color="#64748b"
        />

      </View>


      <View style={styles.emptySmallContent}>

        <Text style={styles.emptySmallTitle}>
          Nenhuma live salva
        </Text>

        <Text style={styles.emptySmallText}>
          As transmissões salvas deste jogador aparecerão aqui.
        </Text>

      </View>

    </View>

  )}

</View>

  {/* ================================= */}
{/* LINKS */}
{/* ================================= */}

{
  perfil.redes &&
  Object.values(perfil.redes)
    .some((valor) =>
      typeof valor === "string" &&
      valor.trim()
    ) && (

    <View style={styles.section}>

      <Text style={styles.sectionTitle}>
        Links
      </Text>


      <View style={styles.linksCard}>

        {perfil.redes.instagram?.trim() ? (

          <SocialLink
            icon="logo-instagram"
            title="Instagram"
            value={perfil.redes.instagram}
            onPress={() =>
              abrirRede(
                "instagram",
                perfil.redes.instagram
              )
            }
          />

        ) : null}


        {perfil.redes.discord?.trim() ? (

          <SocialLink
            icon="logo-discord"
            title="Discord"
            value={perfil.redes.discord}
            onPress={() =>
              abrirRede(
                "discord",
                perfil.redes.discord
              )
            }
          />

        ) : null}


        {perfil.redes.twitch?.trim() ? (

          <SocialLink
            icon="logo-twitch"
            title="Twitch"
            value={perfil.redes.twitch}
            onPress={() =>
              abrirRede(
                "twitch",
                perfil.redes.twitch
              )
            }
          />

        ) : null}


        {perfil.redes.github?.trim() ? (

          <SocialLink
            icon="logo-github"
            title="GitHub"
            value={perfil.redes.github}
            onPress={() =>
              abrirRede(
                "github",
                perfil.redes.github
              )
            }
          />

        ) : null}


        {perfil.redes.x?.trim() ? (

          <SocialLink
            icon="logo-twitter"
            title="X"
            value={perfil.redes.x}
            onPress={() =>
              abrirRede(
                "x",
                perfil.redes.x
              )
            }
          />

        ) : null}

      </View>

    </View>

  )
}

        {/* ================================= */}
        {/* CONQUISTAS */}
        {/* ================================= */}

        <View style={styles.section}>

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Conquistas
            </Text>

            <Text style={styles.sectionLink}>
              Ver todas
            </Text>

          </View>


          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.achievements
            }
          >

            <View style={styles.achievementLocked}>
              <Ionicons
                name="trophy-outline"
                size={30}
                color="#64748b"
              />
            </View>


            <View style={styles.achievementLocked}>
              <Ionicons
                name="shield-outline"
                size={30}
                color="#64748b"
              />
            </View>


            <View style={styles.achievementLocked}>
              <Ionicons
                name="medal-outline"
                size={30}
                color="#64748b"
              />
            </View>


            <View style={styles.achievementLocked}>
              <Ionicons
                name="star-outline"
                size={30}
                color="#64748b"
              />
            </View>

          </ScrollView>

        </View>


        {/* ================================= */}
        {/* ABAS */}
        {/* ================================= */}

        <View style={styles.tabs}>

          <Pressable
            style={[
              styles.tab,
              abaAtiva === "posts" &&
              styles.tabActive,
            ]}
            onPress={() =>
              setAbaAtiva("posts")
            }
          >

            <Text
              style={[
                styles.tabText,
                abaAtiva === "posts" &&
                styles.tabTextActive,
              ]}
            >
              Posts
            </Text>

          </Pressable>


          <Pressable
            style={[
              styles.tab,
              abaAtiva === "produtos" &&
              styles.tabActive,
            ]}
            onPress={() =>
              setAbaAtiva("produtos")
            }
          >

            <Text
              style={[
                styles.tabText,
                abaAtiva === "produtos" &&
                styles.tabTextActive,
              ]}
            >
              Produtos
            </Text>

          </Pressable>


          <Pressable
            style={[
              styles.tab,
              abaAtiva === "conquistas" &&
              styles.tabActive,
            ]}
            onPress={() =>
              setAbaAtiva("conquistas")
            }
          >

            <Text
              style={[
                styles.tabText,
                abaAtiva === "conquistas" &&
                styles.tabTextActive,
              ]}
            >
              Conquistas
            </Text>

          </Pressable>

        </View>


        {/* ================================= */}
        {/* CONTEÚDO DAS ABAS */}
        {/* ================================= */}

        <View style={styles.tabContent}>

          {abaAtiva === "posts" && (

            <EmptyTab
              icon="create-outline"
              title="Nenhuma publicação ainda"
              text="Quando você publicar algo, seus posts aparecerão aqui."
            />

          )}


          {abaAtiva === "produtos" && (

            <EmptyTab
              icon="bag-outline"
              title="Nenhum produto ainda"
              text="Produtos publicados no marketplace aparecerão aqui."
            />

          )}


          {abaAtiva === "conquistas" && (

            <EmptyTab
              icon="trophy-outline"
              title="Nenhuma conquista exibida"
              text="Escolha suas conquistas favoritas para mostrar no perfil."
            />

          )}

        </View>


        {/* ================================= */}
        {/* PERSONALIZAR */}
        {/* ================================= */}

        <Pressable
          style={styles.customizeButton}
        >

          <Ionicons
            name="color-palette-outline"
            size={20}
            color="#38bdf8"
          />

          <Text style={styles.customizeText}>
            Personalizar perfil
          </Text>

        </Pressable>


      </ScrollView>

<EditProfileModal
  visible={editarPerfilAberto}
  perfil={perfil}

  onClose={() =>
    setEditarPerfilAberto(false)
  }

  onSaved={(perfilAtualizado) => {

    setPerfil(
      perfilAtualizado
    );

  }}
/>

    </View>

  );

}

function LiveProfileCard({
  live
}) {

  const dataEncerramento =
    live.encerrada_em
      ? new Date(
          live.encerrada_em
        ).toLocaleDateString(
          "pt-BR"
        )
      : null;


  async function abrirLive() {

    if (!live.url) {
      return;
    }

    try {

      await Linking.openURL(
        live.url
      );

    }
    catch (error) {

      console.error(
        "Erro ao abrir live:",
        error
      );

    }

  }


  return (

    <Pressable
      style={styles.liveProfileCard}
      onPress={abrirLive}
    >

      <View style={styles.liveThumbArea}>

        {live.thumbnail ? (

  <Image
    source={{
      uri: live.thumbnail
    }}
    style={styles.liveThumbnail}
  />

) : (

  <View
    style={[
      styles.liveThumbnail,
      styles.liveThumbnailFallback,
    ]}
  >

    <Ionicons
      name="play-circle-outline"
      size={54}
      color="#64748b"
    />

  <Text style={styles.liveFallbackText}>
  Replay da transmissão
</Text>
  </View>

)}


        {live.ao_vivo ? (

          <View style={styles.liveBadgeOn}>

            <View style={styles.liveDot} />

            <Text style={styles.liveBadgeText}>
              AO VIVO
            </Text>

          </View>

        ) : (

          <View style={styles.liveBadgeEnded}>

            <Ionicons
              name="checkmark-circle"
              size={14}
              color="#ffffff"
            />

            <Text style={styles.liveBadgeText}>
              ENCERRADA
            </Text>

  </View>

)}


<View style={styles.liveViewers}>

  <Ionicons
    name="people"
    size={15}
    color="#ffffff"
  />

  <Text style={styles.liveViewersText}>
    {
      live.ao_vivo
        ? `${live.espectadores || 0}`
        : `Pico ${live.pico_espectadores || 0}`
    }
  </Text>

</View>


</View>


      <View style={styles.liveCardBody}>

        <Text
          style={styles.liveCardTitle}
          numberOfLines={1}
        >
          {
            live.titulo ||
            "Transmissão"
          }
        </Text>


        <Text
          style={styles.liveCardGame}
          numberOfLines={1}
        >
          🎮 {
            live.jogo ||
            live.categoria ||
            "Sem categoria"
          }
        </Text>


        {live.ao_vivo ? (

          <Text style={styles.liveNowText}>
            Transmitindo agora
          </Text>

        ) : (

          <Text style={styles.liveEndedDate}>
            {
              dataEncerramento
                ? `Encerrada em ${dataEncerramento}`
                : "Transmissão encerrada"
            }
          </Text>

        )}

      </View>

    </Pressable>

  );

}

function SocialLink({
  icon,
  title,
  value,
  onPress,
}) {

  return (

    <Pressable
      style={styles.socialLink}
      onPress={onPress}
    >

      <View style={styles.socialIcon}>

        <Ionicons
          name={icon}
          size={23}
          color="#ffffff"
        />

      </View>


      <View style={styles.socialInfo}>

        <Text style={styles.socialTitle}>
          {title}
        </Text>

        <Text
          style={styles.socialValue}
          numberOfLines={1}
        >
          {value}
        </Text>

      </View>


      <Ionicons
        name="chevron-forward"
        size={20}
        color="#64748b"
      />

    </Pressable>

  );

}

function EmptyTab({
  icon,
  title,
  text,
}) {

  return (

    <View style={styles.emptyTab}>

      <View style={styles.emptyTabIcon}>

        <Ionicons
          name={icon}
          size={40}
          color="#64748b"
        />

      </View>


      <Text style={styles.emptyTabTitle}>
        {title}
      </Text>


      <Text style={styles.emptyTabText}>
        {text}
      </Text>

    </View>

  );

}


const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },


    scroll: {
      flex: 1,
    },


    content: {
      paddingBottom: 40,
    },


    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
    },


    errorText: {
      color: colors.textMuted,
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 30,
    },


    // =====================================
    // HERO
    // =====================================

    profileHero: {
      height: 230,
      position: "relative",
    },


    banner: {
      height: 180,
      width: "100%",
    },


    bannerImage: {
      resizeMode: "cover",
    },


    bannerFallback: {
      backgroundColor: "#071426",
      alignItems: "center",
      justifyContent: "center",
    },


    bannerOverlay: {
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.18)",
    },


    changeBannerButton: {
      position: "absolute",

      top: 126,
      right: 18,

      height: 40,

      flexDirection: "row",
      alignItems: "center",

      gap: 7,

      paddingHorizontal: 14,

      backgroundColor:
        "rgba(7,13,18,0.86)",

      borderRadius: 12,
    },


    changeBannerText: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "700",
    },


    avatarWrapper: {
      position: "absolute",

      left: 24,
      bottom: 0,

      width: 114,
      height: 114,

      borderRadius: 57,

      padding: 4,

      backgroundColor: "#071018",

      borderWidth: 3,
      borderColor: "#38bdf8",
    },


    avatar: {
      width: "100%",
      height: "100%",

      borderRadius: 52,
    },


    avatarFallback: {
      alignItems: "center",
      justifyContent: "center",

      backgroundColor: "#101827",
    },

avatarEditButton: {

  position: "absolute",

  right: 1,
  bottom: 1,

  width: 34,
  height: 34,

  borderRadius: 17,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor: "#2563eb",

  borderWidth: 3,
  borderColor: "#071018",

},

    // =====================================
    // IDENTITY
    // =====================================

    identity: {
      paddingHorizontal: 24,
      paddingTop: 16,
    },


    gamertag: {
      color: "#ffffff",

      fontSize: 28,
      fontWeight: "900",
    },


    realName: {
      color: colors.textMuted,

      fontSize: 14,

      marginTop: 2,
    },


    badgesRow: {
      flexDirection: "row",
      alignItems: "center",

      gap: 9,

      marginTop: 13,
    },


    levelBadge: {
      flexDirection: "row",
      alignItems: "center",

      gap: 6,

      backgroundColor: "#2563eb",

      paddingHorizontal: 12,
      paddingVertical: 7,

      borderRadius: 999,
    },


    levelText: {
      color: "#ffffff",

      fontWeight: "800",
      fontSize: 13,
    },


    rankBadge: {
      flexDirection: "row",
      alignItems: "center",

      gap: 6,

      paddingHorizontal: 12,
      paddingVertical: 7,

      borderRadius: 999,

      borderWidth: 1,
      borderColor: "#38bdf8",
    },


    rankText: {
      color: "#38bdf8",

      fontSize: 13,
      fontWeight: "700",
    },


    bioArea: {
      paddingHorizontal: 24,
      paddingTop: 20,
    },


    bio: {
      color: "#94a3b8",

      fontSize: 15,
      lineHeight: 22,
    },


    // =====================================
    // ACTIONS
    // =====================================

    actionsRow: {
      flexDirection: "row",

      gap: 10,

      paddingHorizontal: 24,

      marginTop: 22,
    },


    primaryButton: {
      flex: 1,

      height: 48,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 8,

      borderRadius: 14,

      backgroundColor: "#2563eb",
    },


    secondaryButton: {
      flex: 1,

      height: 48,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 8,

      borderRadius: 14,

      backgroundColor: "#101827",

      borderWidth: 1,
      borderColor: "#1e293b",
    },


    primaryButtonText: {
      color: "#ffffff",
      fontWeight: "800",
    },


    secondaryButtonText: {
      color: "#ffffff",
      fontWeight: "800",
    },


    // =====================================
    // STATS
    // =====================================

    statsCard: {
      marginHorizontal: 24,
      marginTop: 24,

      paddingVertical: 18,

      flexDirection: "row",
      alignItems: "center",

      backgroundColor: "#0d1522",

      borderRadius: 18,

      borderWidth: 1,
      borderColor: "#1e293b",
    },


    statItem: {
      flex: 1,
      alignItems: "center",
    },


    statValue: {
      color: "#ffffff",

      fontSize: 17,
      fontWeight: "900",
    },


    statLabel: {
      color: "#64748b",

      fontSize: 11,

      marginTop: 4,
    },


    statDivider: {
      width: 1,
      height: 32,

      backgroundColor: "#1e293b",
    },


    // =====================================
    // SECTIONS
    // =====================================

    section: {
      marginTop: 30,

      paddingHorizontal: 24,
    },


    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      marginBottom: 14,
    },


    sectionTitleRow: {
      flexDirection: "row",
      alignItems: "center",

      gap: 8,
    },


    sectionTitle: {
      color: "#ffffff",

      fontSize: 21,
      fontWeight: "900",
    },


    sectionLink: {
      color: "#38bdf8",

      fontSize: 14,
      fontWeight: "700",
    },


    // =====================================
    // LIVE
    // =====================================

    emptySmall: {
      minHeight: 88,

      flexDirection: "row",
      alignItems: "center",

      gap: 13,

      padding: 15,

      backgroundColor: "#0d1522",

      borderWidth: 1,
      borderColor: "#1e293b",

      borderRadius: 16,
    },


    emptyIcon: {
      width: 48,
      height: 48,

      borderRadius: 14,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor: "#101827",
    },


    emptySmallContent: {
      flex: 1,
    },


    emptySmallTitle: {
      color: "#ffffff",

      fontWeight: "800",
      fontSize: 15,
    },


    emptySmallText: {
      color: "#64748b",

      marginTop: 4,

      fontSize: 12,
      lineHeight: 17,
    },


    // =====================================
    // LINKS
    // =====================================

    linksCard: {
      marginTop: 14,

      backgroundColor: "#0d1522",

      borderRadius: 16,

      borderWidth: 1,
      borderColor: "#1e293b",

      overflow: "hidden",
    },


    linkItem: {
      height: 58,

      flexDirection: "row",
      alignItems: "center",

      gap: 13,

      paddingHorizontal: 16,
    },


    linkText: {
      flex: 1,

      color: "#ffffff",

      fontSize: 15,
      fontWeight: "600",
    },


    linkDivider: {
      height: 1,

      marginLeft: 50,

      backgroundColor: "#1e293b",
    },


    // =====================================
    // ACHIEVEMENTS
    // =====================================

    achievements: {
      gap: 12,
      paddingTop: 4,
    },


    achievementLocked: {
      width: 78,
      height: 78,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 20,

      backgroundColor: "#0d1522",

      borderWidth: 1,
      borderColor: "#1e293b",
    },


    // =====================================
    // TABS
    // =====================================

    tabs: {
      flexDirection: "row",

      marginHorizontal: 24,
      marginTop: 34,

      padding: 4,

      borderRadius: 14,

      backgroundColor: "#0d1522",
    },


    tab: {
      flex: 1,

      height: 42,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 11,
    },


    tabActive: {
      backgroundColor: "#172033",
    },


    tabText: {
      color: "#64748b",

      fontSize: 13,
      fontWeight: "700",
    },


    tabTextActive: {
      color: "#ffffff",
    },


    tabContent: {
      marginHorizontal: 24,
      marginTop: 15,
    },


    emptyTab: {
      minHeight: 240,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 25,

      backgroundColor: "#0d1522",

      borderWidth: 1,
      borderColor: "#1e293b",

      borderRadius: 20,
    },


    emptyTabIcon: {
      width: 72,
      height: 72,

      borderRadius: 22,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor: "#101827",

      marginBottom: 17,
    },


    emptyTabTitle: {
      color: "#ffffff",

      fontSize: 18,
      fontWeight: "900",

      textAlign: "center",
    },


    emptyTabText: {
      color: "#64748b",

      fontSize: 14,
      lineHeight: 20,

      textAlign: "center",

      marginTop: 7,
    },

socialLink: {
  minHeight: 66,

  flexDirection: "row",
  alignItems: "center",

  gap: 12,

  paddingHorizontal: 16,

  borderBottomWidth: 1,
  borderBottomColor: "#1e293b",
},

socialIcon: {
  width: 38,
  height: 38,

  alignItems: "center",
  justifyContent: "center",

  borderRadius: 12,

  backgroundColor: "#101827",
},

socialInfo: {
  flex: 1,
},

socialTitle: {
  color: "#ffffff",

  fontSize: 15,
  fontWeight: "800",
},

socialValue: {
  color: "#64748b",

  fontSize: 12,

  marginTop: 2,
},

savedLivesCarousel: {
  gap: 14,
  paddingRight: 24,
},

liveProfileCard: {
  width: 285,

  backgroundColor: "#0d1522",

  borderWidth: 1,
  borderColor: "#1e293b",

  borderRadius: 18,

  overflow: "hidden",
},

liveThumbArea: {
  width: "100%",
  height: 160,

  position: "relative",

  backgroundColor: "#071018",
},

liveThumbnail: {
  width: "100%",
  height: "100%",

  resizeMode: "cover",
},

liveThumbnailFallback: {
  alignItems: "center",
  justifyContent: "center",
},

liveBadgeOn: {
  position: "absolute",

  top: 12,
  left: 12,

  height: 32,

  flexDirection: "row",
  alignItems: "center",

  gap: 6,

  paddingHorizontal: 11,

  borderRadius: 999,

  backgroundColor: "#ef4444",
},

liveBadgeEnded: {
  position: "absolute",

  top: 12,
  left: 12,

  height: 32,

  flexDirection: "row",
  alignItems: "center",

  gap: 5,

  paddingHorizontal: 10,

  borderRadius: 999,

  backgroundColor: "rgba(15,23,42,0.90)",
},

liveDot: {
  width: 8,
  height: 8,

  borderRadius: 4,

  backgroundColor: "#ffffff",
},

liveBadgeText: {
  color: "#ffffff",

  fontSize: 11,
  fontWeight: "900",
},

liveViewers: {
  position: "absolute",

  top: 12,
  right: 12,

  height: 30,

  flexDirection: "row",
  alignItems: "center",

  gap: 5,

  paddingHorizontal: 9,

  borderRadius: 999,

  backgroundColor: "rgba(0,0,0,0.72)",
},

liveViewersText: {
  color: "#ffffff",

  fontSize: 11,
  fontWeight: "800",
},

liveCardBody: {
  padding: 14,
},

liveCardTitle: {
  color: "#ffffff",

  fontSize: 16,
  fontWeight: "900",
},

liveCardGame: {
  color: "#38bdf8",

  fontSize: 13,

  marginTop: 6,
},

liveEndedDate: {
  color: "#64748b",

  fontSize: 12,

  marginTop: 8,
},

liveNowText: {
  color: "#ef4444",

  fontSize: 12,
  fontWeight: "800",

  marginTop: 8,
},

liveFallbackText: {
  color: "#94a3b8",
  fontSize: 13,
  fontWeight: "700",
  marginTop: 10,
  textAlign: "center",
  paddingHorizontal: 20,
},

liveFallbackText: {
  color: "#64748b",
  fontSize: 14,
  fontWeight: "700",
  marginTop: 10,
},

    // =====================================
    // CUSTOMIZE
    // =====================================

    customizeButton: {
      height: 50,

      marginHorizontal: 24,
      marginTop: 18,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 8,

      backgroundColor: "#0d1522",

      borderWidth: 1,
      borderColor: "#38bdf8",

      borderRadius: 16,
    },


    customizeText: {
      color: "#38bdf8",

      fontWeight: "800",
      fontSize: 15,
    },

  });