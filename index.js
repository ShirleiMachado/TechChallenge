//não é possível usar o export default pq é script. 
module.exports = (customer_success, customers, customer_success_away, scenario) => {
  let allCustomers = new Set(customers);

  const CSs = customer_success
    .filter(({ id }) => !customer_success_away.includes(id)) // todos que não estão no away são aptos
    .sort((a, b) => a.score - b.score) //organiza os CSs por ordem de score
    .map((cs) => balancingCSs(allCustomers, cs)) //mapeia o array de CSs efetuando as operações dentro do balancingCSs
    .sort((a, b) => b.customersCount - a.customersCount); //ordena os CSs

  const first = CSs[0];
  const second = CSs[1];


  if (first.customersCount === second.customersCount) {//condição de saída caso haja empate
    console.log(scenario, "draw: 0")
    console.log(CSs)
    return 0
  }
  console.log(scenario + " winner: " + first.id)
  console.log(CSs)
  return first.id
};

const balancingCSs = (allCustomers, cs) => {
  let customersCount = 0; //contador clientes
  let customerArray = [] //devolve o array de clientes atendidos pelo CSs correspondente
  allCustomers.forEach((customer) => { //loop que verifica cada condição de score
    if (customer.score <= cs.score) { //confere a condição do score entre o cliente e o CSs 
      allCustomers.delete(customer); // deleta para que clientes não sejam atendidos por mais de 1 vendedor
      customerArray.push(customer.id); // adiciona no array o id do cliente
      customersCount++; //conta os clientes
    }
  });
  return {
    ...cs,
    customersCount,
    customerArray
  };
}