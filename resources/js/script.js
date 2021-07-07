
$(document).ready(function(){
		
	    
	$('.header-content').click(function(){
			
		$("#page-content").toggleClass('toggle-close');
				
	});	
		
		$('.prod-content').click(function(){
			
		$("#page-content").removeClass('toggle-close');
				
	});	
	
	
	
	var domainOptions = {
    val1 : 'Research_and_Development',
    val2 : 'Manufacturing_and_SupplyChain',
	val3 : 'Sales_and_Marketing',
    val4 : 'MedicalDevices',
	val5 : 'Enterprise',
	
	};
	
	var subdomainOptions = {
    val1 : 'Discovery_Preclinical',
    val2 : 'Clinical',
	val3 : 'PVandSafety',
    val4 : 'RegulatoryandCompliance'
	
	};
	
	var techOptions = {
    val1 : 'AB INITIO',
    val2 : 'ABAP',
	val3 : 'Abinitio 10',
    val4 : 'Access DB',
	val5 : 'Actional DxSI',
    val6 : 'Actuate',
	val7 : 'Adobe AEM',
    val8 : 'Akana API Management'
	
	};
	
	var LOSOptions = {
    val1 : 'ADM',
    val2 : 'BPO',
	val3 : 'CDB - AI & Analytics',
    val4 : 'CDB - IoT',
	val5 : 'CDB Consulting',
    val6 : 'CDB-Interactive',
	val7 : 'Cognizant Digital Business',
    val8 : 'Cognizant Digital Engineering ',
	val8 : 'Cognizant Infra Services '
	
	};
	

	var LOSSelect = $('#LOS');
	$.each(LOSOptions, function(val, text) {
		LOSSelect.append(
			$('<option></option>').val(val).html(text)
		);
	});
	


	var techSelect = $('#techOptions');
	$.each(techOptions, function(val, text) {
		techSelect.append(
			$('<option></option>').val(val).html(text)
		);
	});
	

	var domainSelect = $('#domain');
	$.each(domainOptions, function(val, text) {
		domainSelect.append(
			$('<option></option>').val(val).html(text)
		);
	});
	
	var subdomainSelect = $('#subdomain');
	$.each(subdomainOptions, function(val, text) {
		subdomainSelect.append(
			$('<option></option>').val(val).html(text)
		);
	});
	

PVandSafety
RegulatoryandCompliance

	
	
	
	
	
	
	
	
	
	
	
	
		
		
		
	
});
