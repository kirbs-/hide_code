{%- extends 'full.tpl' -%}

{%-block html_head-%}
<style type="text/css">
div.output_subarea {
	max-width: 100% !important;
}
</style>
{{ super() }}
{%- endblock html_head -%}

{%- block input -%}
	{%- if cell.metadata.hideCode -%}
		<div></div>
	{%- else -%}
		{{ super() }}
	{%- endif -%}
{%- endblock input -%}

{%- block in_prompt -%}
	{%- if cell.metadata.hidePrompt -%}
		<div class="prompt input_prompt"></div>
	{%- else -%}
		{{ super() }}
	{%- endif -%}
{%- endblock in_prompt -%}

{% block output %}
<div class="output_area">
	{%- if output.output_type == 'execute_result' and not cell.metadata.hidePrompt -%}
	    <div class="prompt output_prompt">
	{%- if cell.execution_count is defined -%}
	    Out[{{ cell.execution_count|replace(None, "&nbsp;") }}]:
	{%- else -%}
	    Out[&nbsp;]:
	{%- endif -%}
	{%- else -%}
	    <div class="prompt">
	{%- endif -%}
	</div>
	{%- if cell.metadata.hideOutput -%}
  {%- else -%}
	    {% block execute_result -%}	{{ super() }} {%- endblock execute_result %}
	    {%- block stream -%} {{ super() }} {%- endblock stream -%}
	    {%- if output.output_type == 'error' -%}
		      {%- block error -%} {{ super() }} {%- endblock error -%}
	    {%- endif -%}
  {%- endif -%}
</div>
{% endblock output %}
