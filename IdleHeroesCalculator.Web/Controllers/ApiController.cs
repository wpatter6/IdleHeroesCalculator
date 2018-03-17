using System;
using GraphQL;
using Microsoft.AspNetCore.Mvc;
using GraphQL.Types;
using System.Threading.Tasks;
using Newtonsoft.Json;
using IdleHeroesCalculator.Web.Graph.Models;
using Newtonsoft.Json.Serialization;
using System.Linq;

namespace IdleHeroesCalculator.Web.Controllers
{
    public class ApiController : Controller
    {
        private readonly ISchema _schema;
        private readonly IDocumentExecuter _documentExecutor;
        private readonly ProgramStartDate _startDate;

        public ApiController(IDocumentExecuter documentExecutor, ISchema schema, ProgramStartDate startDate)
        {
            _documentExecutor = documentExecutor;
            _schema = schema;
            _startDate = startDate;
        }

        [HttpPost]
        public async Task<IActionResult> Index([FromBody] GraphQLQuery query)
        {
            if (query == null) { throw new ArgumentNullException(nameof(query)); }

            if (!string.IsNullOrEmpty(query.Variables))
            {
                var variables = JsonConvert.DeserializeObject<GraphVariables>(query.Variables,
                    new JsonSerializerSettings { Error = delegate(object sender, ErrorEventArgs args) { args.ErrorContext.Handled = true; } });

                //Handle variables
                if (variables != null)
                {
                    //Don't bother to update cache if newer than app start
                    if(variables.CacheDate > _startDate.StartDateUnixTicks)
                        return Ok(new object());
                }
            }

            var executionOptions = new ExecutionOptions { Schema = _schema, Query = query.Query };
            
            var result = await _documentExecutor.ExecuteAsync(executionOptions).ConfigureAwait(false);

            if(result.Errors != null && result.Errors.Any())
            {
                return StatusCode(500, result);
            }
            
            return Ok(result);
        }
    }
}