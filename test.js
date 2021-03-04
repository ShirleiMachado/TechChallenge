const CustomerSuccessBalancing = require("./index");

const toScored = (score, key) => ({ id: key + 1, score });
//adicionar +1 a cada posição de array para combinar com os ids
//quando chamado no map ele percorre o array organiza com o sort, filtra e 
//conta, compara e devolve o resultado.

describe("CustomerSuccessBalancingTests", () => {
  const scenarios = [ //descrevendo cenários
    [
      "test_scenario_one",
      [
        { id: 1, score: 60 },
        { id: 2, score: 20 },
        { id: 3, score: 95 },
        { id: 4, score: 75 },
      ],
      [
        { id: 1, score: 90 },
        { id: 2, score: 20 },
        { id: 3, score: 70 },
        { id: 4, score: 40 },
        { id: 5, score: 60 },
        { id: 6, score: 10 },
      ],
      [2, 4], //custumerSuccess folga/doentes
      1,
    ],

    [
      "test_scenario_two",
      [11, 21, 31, 3, 4, 5].map(toScored), //vendedor
      [10, 10, 10, 20, 20, 30, 30, 30, 20, 60].map(toScored), // cliente
      [], 0,
    ],// empate entre CSs 1, 2 e 3. Sem vencedor.
    //cada um atende 3 e os de score mais baixo, nenhum

    [
      "test_scenario_three",
      Array.from({ length: 1000 }, (_, index) => (index === 998 ? 100 : 0)).map(
        toScored
      ),// cria um array de tam mil e atribui a todos os elementos o valor 0, exceto o elemento
      //index 998, que será o vendedor de id 999

      Array.from({ length: 10000 }, () => 10).map(toScored),
      //cria uma array de tmb 10mil e atribui a todos os elementos o valor 10

      [1000],
      { timeout: 999 },
    ],// aqui ele pega o id 999 com score 100 que sozinho atende todo mundo, visto que todos os outros tem score 0
    //O método Array.from() cria uma nova instância de um Array com o .map ele executa
    //a função para cada elemento do array que está sendo criado.

    [
      "test_scenario_four",
      [1, 2, 3, 4, 5, 6].map(toScored),
      [10, 10, 10, 20, 20, 30, 30, 30, 20, 60].map(toScored),
      [], 0,
    ],//nenhum CS tem score para atender aos clientes, todos tem score 
    //muito baixo então o resultado é 0 

    [
      "test_scenario_five",
      [100, 2, 3, 3, 4, 5].map(toScored),
      [10, 10, 10, 20, 20, 30, 30, 30, 20, 60].map(toScored),
      [], 1,
    ],//apenas o id 1 tem score para atender todos os clientes. 

    [
      "test_scenario_six",
      [100, 99, 88, 3, 4, 5].map(toScored),
      [10, 10, 10, 20, 20, 30, 30, 30, 20, 60].map(toScored),
      [1, 3, 2], 0,
    ],//depois de filtrar não sobrou nenhum CS com score para 
    //atender aos clientes pq os ids 1,3 e 2 estão indisponiveis.

    [
      "test_scenario_seven",
      [100, 99, 88, 3, 4, 5].map(toScored),
      [10, 10, 10, 20, 20, 30, 30, 30, 20, 60].map(toScored),
      [4, 5, 6], 3,
    ],//o CS de id 3 consegue sozinho atender todos os clientes sem que precise 
    //chegar aos scores mais altos
  ];

  //O test.each pega o array scenarios e pra cada um dos itens desse array 
  //(cada caso de teste) ele pega o nome do teste (scenario), os vendedores (css ), 
  //os clientes (customers), os vendedores indisponíveis (away) e o valor esperado 
  //de resposta (expected).
  test.each(scenarios)("%s", (scenario, css, customers, away, expected) => {
    if (!expected.timeout)
      return expect(CustomerSuccessBalancing(css, customers, away, scenario)).toBe(
        expected
      );

    //controla o tempo de performance dos testes. O valor retornado por t1-t0 representa 
    //o tempo decorrido da execução
    const t0 = performance.now();
    const result = CustomerSuccessBalancing(css, customers, away, scenario);
    const t1 = performance.now();
    expect(t1 - t0).toBeLessThan(1000);
    expect(result).toBe(999);
  });
});
